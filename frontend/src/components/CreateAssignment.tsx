import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { createCalendarEvent } from '../utils/googleCalendar';

interface Machine {
  _id: string;
  hollowShaftLine: string;
  machineNumber: string;
  machineName: string;
  model: string;
}

export default function CreateAssignment() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<'name' | 'number' | 'model' | ''>('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || '';
  const userId = localStorage.getItem('user_id') || '';

  // Get today's date in YYYY-MM-DD for minimum date picker (Local timezone fixed)
  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${backendUrl}/api/shed2machine`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMachines(data.machines);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to load machines');
    }
  };

  // Derive unique lines
  const uniqueLines = Array.from(new Set(machines.map(m => m.hollowShaftLine)));

  // Filter machines by selected line
  const availableMachines = machines.filter(m => m.hollowShaftLine === selectedLine);

  const performAssignmentAndCalendarSync = async (googleAccessToken: string) => {
    setLoading(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const appToken = localStorage.getItem('access_token'); // Backend JWT

    try {
      const payload = {
        engineerId: userId,
        engineerName: userName,
        inspectionDate: inspectionDate,
        googleEventId: ""
      };
      // 2. Google Calendar Event Creation using Google Access Token
      const calendarResponse = await createCalendarEvent(googleAccessToken, payload);
      if (calendarResponse) {
        console.log("google api respose")
        payload.googleEventId = calendarResponse
      }

      // 1. Backend Assignment Creation
      const response = await fetch(`${backendUrl}/api/shed2machine/${selectedMachineId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${appToken}`
        },
        body: JSON.stringify(payload),
      });


      if (response.ok) {
        alert("Assignment and Calendar Event created successfully!");
        navigate('/dashboard');
      } else {
        const err = await response.json();
        alert(`Failed: ${err.detail || 'Could not sync with Calendar'}`);
      }
    } catch (error) {
      alert("Error connecting to server or Google API.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // Ye Google ka real access token hai
      performAssignmentAndCalendarSync(tokenResponse.access_token);
    },
    onError: () => {
      alert('Google Login Failed. Cannot create calendar event.');
    },
    scope: 'https://www.googleapis.com/auth/calendar.events'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachineId) {
      alert("Please select a machine first.");
      return;
    }
    // Form submit hote hi pehle Google permission mangenge
    handleGoogleLogin();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-4 font-sans text-slate-100">
      <div className="max-w-3xl mx-auto w-full mt-10">

        <button onClick={() => navigate('/dashboard')} className="text-indigo-400 hover:text-indigo-300 mb-6 flex items-center gap-2 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Dashboard
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <h2 className="text-3xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-6">
            Create Inspector Assignment
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Step 1: Select Line */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">1. Line</label>
              <select
                required
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/60 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                value={selectedLine}
                onChange={(e) => {
                  setSelectedLine(e.target.value);
                  setSelectedMachineId(''); // reset machine selection
                  setActiveDropdown('');
                }}
              >
                <option value="" disabled>-- Select a Line --</option>
                {uniqueLines.map((line, idx) => (
                  <option key={idx} value={line}>{line.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Machine via One of Three Qualifiers */}
            {selectedLine && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 bg-slate-900/50 p-4 border border-slate-700/50 rounded-xl">
                <label className="text-sm font-medium text-indigo-300">2. Select Machine (Pick any ONE dropdown)</label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Select by Name */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 ml-1">By Machine Name</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-950/50 border border-slate-700/60 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                      value={activeDropdown === 'name' ? selectedMachineId : ''}
                      onChange={(e) => {
                        setActiveDropdown('name');
                        setSelectedMachineId(e.target.value);
                      }}
                    >
                      <option value="" disabled>-- Select Name --</option>
                      {availableMachines.filter(m => m.machineName.trim()).map(m => (
                        <option key={m._id} value={m._id}>{m.machineName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select by Number */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 ml-1">By Machine Number</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-950/50 border border-slate-700/60 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                      value={activeDropdown === 'number' ? selectedMachineId : ''}
                      onChange={(e) => {
                        setActiveDropdown('number');
                        setSelectedMachineId(e.target.value);
                      }}
                    >
                      <option value="" disabled>-- Select Number --</option>
                      {availableMachines.filter(m => m.machineNumber.trim()).map(m => (
                        <option key={m._id} value={m._id}>{m.machineNumber}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select by Model */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 ml-1">By Model</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-950/50 border border-slate-700/60 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                      value={activeDropdown === 'model' ? selectedMachineId : ''}
                      onChange={(e) => {
                        setActiveDropdown('model');
                        setSelectedMachineId(e.target.value);
                      }}
                    >
                      <option value="" disabled>-- Select Model --</option>
                      {availableMachines.filter(m => m.model.trim()).map(m => (
                        <option key={m._id} value={m._id}>{m.model}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pr-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMachineId('');
                      setActiveDropdown('');
                    }}
                    className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Select Date */}
            {selectedMachineId && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-sm font-medium text-slate-300 ml-1">3. Select Future Inspection Date</label>
                <input
                  type="date"
                  required
                  min={today} // Prevents past dates!
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/60 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                />
              </div>
            )}

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || !selectedMachineId || !inspectionDate}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold py-4 rounded-xl shadow-lg transition-all"
              >
                {loading ? 'Processing...' : 'Confirm Assignment Schedule'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

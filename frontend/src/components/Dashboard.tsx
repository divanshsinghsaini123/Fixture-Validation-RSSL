import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
interface Assignment {
  engineerId: string;
  engineerName: string;
  inspectionDate: string;
  status: string;
  googleEventId?: string;
}

interface Machine {
  _id: string;
  hollowShaftLine: string;
  machineNumber: string;
  machineName: string;
  model: string;
  scheduledTo?: Assignment[];
  checkSheetTemplate?: any[];
}

export default function Dashboard() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userName = localStorage.getItem('user_name') || 'Engineer';
  const userId = localStorage.getItem('user_id') || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDeleteAssignment = async (machineId: string, inspectionDate: string) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${backendUrl}/api/shed2machine/${machineId}/assignment/${userId}/${inspectionDate}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchData();
      } else {
        alert('Failed to delete assignment');
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  // Process Assignments
  const myAssignments: (Assignment & { machine: Machine })[] = [];
  machines.forEach(machine => {
    if (machine.scheduledTo) {
      machine.scheduledTo.forEach(assignment => {
        // filter for this specific engineer
        if (assignment.engineerId === userId) {
          // If status wasn't originally saved in MongoDB before the fix, assume pending
          if (!assignment.status) assignment.status = 'pending';

          myAssignments.push({ ...assignment, machine });
        }
      });
    }
  });

  // Calculate stats
  const stats = {
    total: myAssignments.length,
    completed: myAssignments.filter(a => a.status === 'completed').length,
    pending: myAssignments.filter(a => a.status === 'pending').length,
    overdue: myAssignments.filter(a => a.status === 'missed').length,
  };

  // Filter Upcoming: pending status, sorted by date ascending
  // Fix Timezone bug by shifting to local timezone offset
  const now = new Date();
  const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  const upcomingAssignments = myAssignments
    .filter(a => a.status === 'pending' && a.inspectionDate >= localToday)
    .sort((a, b) => new Date(a.inspectionDate).getTime() - new Date(b.inspectionDate).getTime());



  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg mt-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-500/20">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Hi, {userName}!</h1>
              <p className="text-slate-400 text-sm">Validations Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => navigate('/dashboard/data')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg transition-transform active:scale-95"
            >
              ADD SHED's data
            </button>
            <button
              onClick={() => navigate('/create-assignment')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg transition-transform active:scale-95"
            >
              + Create New Assignment
            </button>
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 border border-slate-700 hover:border-rose-500/50 px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col justify-center">
            <span className="text-slate-400 font-medium">Total Tasks</span>
            <span className="text-4xl font-bold text-white mt-1">{stats.total}</span>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-900/50 p-5 rounded-2xl shadow-lg flex flex-col justify-center">
            <span className="text-emerald-400 font-medium">Completed</span>
            <span className="text-4xl font-bold text-emerald-300 mt-1">{stats.completed}</span>
          </div>
          <div className="bg-amber-950/20 border border-amber-900/50 p-5 rounded-2xl shadow-lg flex flex-col justify-center">
            <span className="text-amber-400 font-medium">Pending</span>
            <span className="text-4xl font-bold text-amber-300 mt-1">{stats.pending}</span>
          </div>
          <div className="bg-rose-950/20 border border-rose-900/50 p-5 rounded-2xl shadow-lg flex flex-col justify-center">
            <span className="text-rose-400 font-medium">Overdue (Missed)</span>
            <span className="text-4xl font-bold text-rose-300 mt-1">{stats.overdue}</span>
          </div>
        </div>

        {/* Upcoming Assignments Board */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Upcoming Tasks
            </h2>
          </div>

          <div className="p-0 sm:p-6">
            {loading ? (
              <div className="text-center p-10 text-slate-400">Loading assignments...</div>
            ) : upcomingAssignments.length === 0 ? (
              <div className="text-center p-12 bg-slate-900 border border-slate-800/50 rounded-xl m-4 sm:m-0">
                <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-lg font-medium text-slate-300">All clear!</h3>
                <p className="text-slate-500 text-sm mt-1">You have no upcoming assignments scheduled.</p>
              </div>
            ) : (
              <div className="space-y-4 p-4 sm:p-0">
                {upcomingAssignments.map((task, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md uppercase tracking-wider">{task.machine.hollowShaftLine}</span>
                        <span className="text-white font-semibold">{task.machine.machineName}</span>
                      </div>
                      <div className="text-slate-400 text-sm flex gap-3">
                        <span>Model: {task.machine.model}</span>
                        <span>•</span>
                        <span className="font-mono text-xs mt-0.5">{task.machine.machineNumber}</span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-slate-400">Due Date</div>
                        <div className="font-semibold text-slate-200">{new Date(task.inspectionDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate('/review', { state: { task } })}
                          title="Add Review"
                          className="h-10 w-10 rounded-full bg-slate-700 hover:bg-emerald-600 flex items-center justify-center text-white transition-all active:scale-95 shadow-md"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(task.machine._id, task.inspectionDate)}
                          title="Delete Assignment"
                          className="h-10 w-10 rounded-full bg-slate-700 hover:bg-rose-600/20 hover:text-rose-400 flex items-center justify-center text-slate-400 transition-all active:scale-95 border border-slate-700 hover:border-rose-500/50 shadow-md"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

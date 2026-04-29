import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
}

export default function TaskCategory() {
  const { category } = useParams<{ category: string }>();
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

  const myAssignments: (Assignment & { machine: Machine })[] = [];
  machines.forEach(machine => {
    if (machine.scheduledTo) {
      machine.scheduledTo.forEach(assignment => {
        if (assignment.engineerId === userId) {
          if (!assignment.status) assignment.status = 'pending';
          myAssignments.push({ ...assignment, machine });
        }
      });
    }
  });

  const filteredAssignments = myAssignments.filter(a => {
    if (category === 'total') return true;
    if (category === 'completed') return a.status === 'completed';
    if (category === 'pending') return a.status === 'pending';
    if (category === 'missed') return a.status === 'missed';
    return true;
  });

  // Sort by date ascending
  filteredAssignments.sort((a, b) => new Date(a.inspectionDate).getTime() - new Date(b.inspectionDate).getTime());

  const getCategoryTitle = () => {
    switch (category) {
      case 'completed': return 'Completed Tasks';
      case 'pending': return 'Pending Tasks';
      case 'missed': return 'Overdue (Missed) Tasks';
      default: return 'Total Tasks';
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/10';
      case 'pending': return 'text-amber-400 bg-amber-500/10';
      case 'missed': return 'text-rose-400 bg-rose-500/10';
      default: return 'text-indigo-400 bg-indigo-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6 mt-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors text-slate-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                {getCategoryTitle()}
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${getCategoryColor()}`}>
                  {filteredAssignments.length}
                </span>
              </h1>
              <p className="text-slate-400 text-sm">Filtered by category</p>
            </div>
          </div>
        </div>

        {/* Assignments Board */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-0 sm:p-6">
            {loading ? (
              <div className="text-center p-10 text-slate-400">Loading assignments...</div>
            ) : filteredAssignments.length === 0 ? (
              <div className="text-center p-12 bg-slate-900 border border-slate-800/50 rounded-xl m-4 sm:m-0">
                <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-lg font-medium text-slate-300">No tasks found</h3>
                <p className="text-slate-500 text-sm mt-1">There are no tasks matching this category.</p>
              </div>
            ) : (
              <div className="space-y-4 p-4 sm:p-0">
                {filteredAssignments.map((task, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md uppercase tracking-wider">{task.machine.hollowShaftLine}</span>
                        <span className="text-white font-semibold">{task.machine.machineName}</span>
                        {task.status === 'completed' && <span className="ml-2 text-xs font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">Completed</span>}
                        {task.status === 'missed' && <span className="ml-2 text-xs font-bold px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded">Missed</span>}
                        {task.status === 'pending' && <span className="ml-2 text-xs font-bold px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded">Pending</span>}
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
                          title={task.status === 'completed' ? "View Review" : "Add Review"}
                          className="h-10 w-10 rounded-full bg-slate-700 hover:bg-emerald-600 flex items-center justify-center text-white transition-all active:scale-95 shadow-md"
                        >
                          {task.status === 'completed' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          )}
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

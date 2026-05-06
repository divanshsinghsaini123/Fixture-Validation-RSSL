import { useNavigate } from 'react-router-dom';

export default function DataDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl text-center space-y-6 bg-slate-900 border border-slate-800 p-8 sm:p-12 rounded-2xl shadow-lg">

        <p className="text-xl text-emerald-400 font-semibold mb-6">
          ADD SHED's data
        </p>

        {/* Action Card inside Data Dashboard */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg text-left my-8 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Shed2 Management</h3>
            <p className="text-slate-400">add data to shed2</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard/shed2')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg transition-transform active:scale-95"
            >
              Add machine
            </button>
            <button
              onClick={() => navigate('/dashboard/shed2/remove')}
              className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg transition-transform active:scale-95"
            >
              Remove-Line
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

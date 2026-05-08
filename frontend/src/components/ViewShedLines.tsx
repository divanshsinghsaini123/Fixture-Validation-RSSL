import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ViewShedLines() {
  const navigate = useNavigate();
  const [lines, setLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLines = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${backendUrl}/api/shed2machine/get_all_lines`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch lines');
        }
        
        const data = await response.json();
        setLines(data.lines || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching lines');
      } finally {
        setLoading(false);
      }
    };

    fetchLines();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans flex flex-col items-center py-8 sm:py-16">
      <div className="w-full max-w-4xl space-y-6 bg-slate-900 border border-slate-800 p-6 sm:p-10 rounded-2xl shadow-lg">
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-800 pb-6">
          <p className="text-2xl text-emerald-400 font-semibold text-center sm:text-left">
            Shed2 Lines
          </p>
          <button
            onClick={() => navigate('/dashboard/view-data')}
            className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-emerald-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-400">Loading lines...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/50 p-6 rounded-xl text-rose-400 text-center">
            {error}
          </div>
        ) : lines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lines.map((line: string, idx: number) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-lg flex items-center justify-between transition-transform hover:scale-[1.02] hover:border-emerald-500/50 group">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Line: {line}
                  </h3>
                </div>
                <button
                  onClick={() => navigate(`/dashboard/view-data/lines/${encodeURIComponent(line)}`)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg transition-transform active:scale-95"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
            <p className="text-slate-400 text-lg">No lines found in Shed2.</p>
          </div>
        )}
      </div>
    </div>
  );
}

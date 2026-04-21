import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MachineReview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const task = state?.task;

  const [status, setStatus] = useState('Pass');
  const [checkSheetRows, setCheckSheetRows] = useState<any[]>(
    task?.machine?.checkSheetTemplate?.map((row: any) => ({
      ...row,
      beforeStatus: '',
      afterStatus: '',
      remark: ''
    })) || []
  );
  const [score, setScore] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="text-center bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-rose-400 mb-4">No Task Selected</h2>
          <p className="text-slate-400 mb-6">Please start a review from your Dashboard's upcoming tasks.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const machine = task.machine;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const token = localStorage.getItem('access_token');
      const engineerId = localStorage.getItem('user_id') || task.engineerId;
      const engineerName = localStorage.getItem('user_name') || task.engineerName;

      const payload = {
        machineId: machine._id,
        engineerId: engineerId,
        engineerName: engineerName,
        reviewDate: new Date().toISOString(),
        status: status,
        checkSheetRows: checkSheetRows,
        score: score === '' ? null : Number(score)
      };

      const response = await fetch(`${backendUrl}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Success, go back to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Machine Validation Review</h1>
            <p className="text-slate-400">Complete your scheduled inspection and record the results below.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <span>Cancel</span>
          </button>
        </div>

        {/* Machine Details Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-slate-500 mb-1">Machine Name</div>
              <div className="text-xl font-bold text-white">{machine.machineName}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Machine Number</div>
              <div className="text-lg font-mono text-indigo-300">{machine.machineNumber}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Hollow Shaft Line</div>
              <div className="inline-block px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-sm">{machine.hollowShaftLine}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Model</div>
              <div className="text-slate-200">{machine.model}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Scheduled Date</div>
              <div className="text-rose-300">{new Date(task.inspectionDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Machine Photographs Gallery */}
          {machine.machineImages && machine.machineImages.length > 0 && (
            <div className="mb-8 group">
              <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Machine Photographs
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {machine.machineImages.map((url: string, idx: number) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-md transition-transform hover:scale-105 hover:z-10 cursor-zoom-in">
                    <img
                      src={url}
                      alt={`Machine ${idx}`}
                      className="w-full h-full object-cover"
                      onClick={() => window.open(url, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Inspection Validation Data</h2>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 rounded-xl text-rose-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Select */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Validation Status *
                </label>
                <select
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3.5 appearance-none focus:outline-none transition-all"
                >
                  <option value="Pass">Passed / Operational</option>
                  <option value="Maintenance">Requires Maintenance</option>
                  <option value="Fail">Failed Validation</option>
                </select>
              </div>

              {/* Score Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Validation Score (1-10) Optional
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3.5 focus:outline-none transition-all"
                  placeholder="e.g. 9"
                />
              </div>
            </div>

            {/* Template Table for Remarks */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-300">
                Inspection Check Sheet - Record Remarks *
              </label>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-900 text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold border-b border-slate-800">S.No</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-800">Contents</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-800">Specification</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-800">Inscription</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-800">Evaluation</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-800 text-center">Before</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-800 text-center">After</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-800">Remark / Observation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {checkSheetRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                        <td className="px-4 py-4 text-slate-400">{row.sNo}</td>
                        <td className="px-4 py-4 font-medium text-slate-200">{row.contents}</td>
                        <td className="px-4 py-4 text-slate-300">{row.specification}</td>
                        <td className="px-4 py-4 text-slate-400 text-xs">{row.inscription}</td>
                        <td className="px-4 py-4 text-slate-400">{row.evaluation}</td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            required
                            value={row.beforeStatus}
                            onChange={(e) => {
                              const newRows = [...checkSheetRows];
                              newRows[idx].beforeStatus = e.target.value;
                              setCheckSheetRows(newRows);
                            }}
                            className="w-16 bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg text-center focus:ring-emerald-500 focus:border-emerald-500 block p-2 focus:outline-none transition-all"
                            placeholder="OK"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            required
                            value={row.afterStatus}
                            onChange={(e) => {
                              const newRows = [...checkSheetRows];
                              newRows[idx].afterStatus = e.target.value;
                              setCheckSheetRows(newRows);
                            }}
                            className="w-16 bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg text-center focus:ring-emerald-500 focus:border-emerald-500 block p-2 focus:outline-none transition-all"
                            placeholder="OK"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            required
                            value={row.remark}
                            onChange={(e) => {
                              const newRows = [...checkSheetRows];
                              newRows[idx].remark = e.target.value;
                              setCheckSheetRows(newRows);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 focus:outline-none transition-all"
                            placeholder="Add remark..."
                          />
                        </td>
                      </tr>
                    ))}
                    {checkSheetRows.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500 italic">
                          No check sheet template defined for this machine.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-medium shadow-lg shadow-emerald-600/20 transition-transform active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Report...
                </>
              ) : (
                'Save Validation Review'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  const navigate = useNavigate();

  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 4000); // fade out after 4 seconds
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    
    try {
      const response = await fetch(`${backendUrl}/api/engineers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_name', data.name);
        showToast('Welcome back, ' + data.name, 'success');
        setTimeout(() => navigate('/shed2'), 1500); 
      } else {
        const err = await response.json();
        showToast(`Login failed: ${err.detail}`, 'error');
      }
    } catch (error) {
      showToast('Network error. Is backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
       {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-500/90 shadow-red-500/20' : 'bg-emerald-500/90 shadow-emerald-500/20'} backdrop-blur text-white font-medium`}>
          {toast.type === 'error' ? (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          )}
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden relative">
        {/* Glow effect */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">Engineer Login</h2>
            <p className="text-slate-400 mt-2 text-sm">Access the Machine Validation Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Email or Phone</label>
              <input 
                type="text" 
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="eng@example.com or 9876543210"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-100 placeholder-slate-500 transition-all outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-100 placeholder-slate-500 transition-all outline-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In To Portal'}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6 text-sm">
            Don't have an engineer account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Request Setup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

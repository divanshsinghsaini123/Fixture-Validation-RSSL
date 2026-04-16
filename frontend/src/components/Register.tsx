import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  const navigate = useNavigate();

  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 4000); // fade out after 4 seconds
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    setLoading(true);
    setToast(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    
    try {
      const response = await fetch(`${backendUrl}/api/engineers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      });
      
      if (response.ok) {
        showToast('Account created successfully! Redirecting...', 'success');
        setTimeout(() => navigate('/login'), 2000); 
      } else {
        const err = await response.json();
        showToast(`Error: ${err.detail}`, 'error');
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

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden relative mt-8 mb-8">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500"></div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">Engineer Signup</h2>
            <p className="text-slate-400 mt-2 text-sm">Create your validation access account</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
              <input 
                type="text" name="name" required value={formData.name} onChange={handleChange}
                placeholder="Ravi Kumar"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-100 placeholder-slate-500 transition-all outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                <input 
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  placeholder="r@co.com"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 ml-1">Phone</label>
                <input 
                  type="text" name="phone" required value={formData.phone} onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
              <input 
                type="password" name="password" required value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
              <input 
                type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full mt-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95"
            >
              {loading ? 'Creating...' : 'Register Account'}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6 text-sm">
            Already registered?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

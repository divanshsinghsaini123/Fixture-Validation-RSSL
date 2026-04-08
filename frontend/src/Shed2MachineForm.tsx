import React, { useState } from 'react';

const Shed2MachineForm: React.FC = () => {
  const [formData, setFormData] = useState({
    hollowShaftLine: '',
    machineNumber: '',
    model: '',
    machineName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted', formData);
    alert('Form Submitted successfully!');
  };

  return (
    <div className="font-sans flex justify-center items-center min-h-screen w-full relative bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#0f172a_100%)] overflow-hidden text-slate-50">
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 w-full max-w-md shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        <h2 className="text-3xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center">
          Machine Registration
        </h2>
        <p className="text-sm text-slate-400 text-center mb-8 font-light">
          Enter the details for your new machine configuration.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          {/* Input Group: Hollow Shaft Line */}
          <div className="relative w-full group">
            <input
              type="text"
              name="hollowShaftLine"
              id="hollowShaftLine"
              value={formData.hollowShaftLine}
              onChange={handleChange}
              required
              className="peer w-full px-4 py-4 bg-slate-900/40 border border-white/10 rounded-xl text-white text-base font-inherit outline-none transition-all duration-300 focus:border-blue-400/80 focus:bg-slate-900/80 focus:shadow-[0_0_0_4px_rgba(96,165,250,0.1)] valid:border-blue-400/80 valid:bg-slate-900/80"
            />
            <label
              htmlFor="hollowShaftLine"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-all duration-300 text-[15px] peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:rounded peer-focus:translate-y-0 peer-valid:-top-2.5 peer-valid:left-3 peer-valid:text-xs peer-valid:text-blue-400 peer-valid:bg-slate-900 peer-valid:px-2 peer-valid:rounded peer-valid:translate-y-0"
            >
              Hollow Shaft Line
            </label>
          </div>

          {/* Input Group: Machine Number */}
          <div className="relative w-full group">
            <input
              type="text"
              name="machineNumber"
              id="machineNumber"
              value={formData.machineNumber}
              onChange={handleChange}
              required
              className="peer w-full px-4 py-4 bg-slate-900/40 border border-white/10 rounded-xl text-white text-base font-inherit outline-none transition-all duration-300 focus:border-blue-400/80 focus:bg-slate-900/80 focus:shadow-[0_0_0_4px_rgba(96,165,250,0.1)] valid:border-blue-400/80 valid:bg-slate-900/80"
            />
            <label
              htmlFor="machineNumber"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-all duration-300 text-[15px] peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:rounded peer-focus:translate-y-0 peer-valid:-top-2.5 peer-valid:left-3 peer-valid:text-xs peer-valid:text-blue-400 peer-valid:bg-slate-900 peer-valid:px-2 peer-valid:rounded peer-valid:translate-y-0"
            >
              Machine Number
            </label>
          </div>

          {/* Input Group: Model */}
          <div className="relative w-full group">
            <input
              type="text"
              name="model"
              id="model"
              value={formData.model}
              onChange={handleChange}
              required
              className="peer w-full px-4 py-4 bg-slate-900/40 border border-white/10 rounded-xl text-white text-base font-inherit outline-none transition-all duration-300 focus:border-blue-400/80 focus:bg-slate-900/80 focus:shadow-[0_0_0_4px_rgba(96,165,250,0.1)] valid:border-blue-400/80 valid:bg-slate-900/80"
            />
            <label
              htmlFor="model"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-all duration-300 text-[15px] peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:rounded peer-focus:translate-y-0 peer-valid:-top-2.5 peer-valid:left-3 peer-valid:text-xs peer-valid:text-blue-400 peer-valid:bg-slate-900 peer-valid:px-2 peer-valid:rounded peer-valid:translate-y-0"
            >
              Model
            </label>
          </div>

          {/* Input Group: Machine Name */}
          <div className="relative w-full group">
            <input
              type="text"
              name="machineName"
              id="machineName"
              value={formData.machineName}
              onChange={handleChange}
              required
              className="peer w-full px-4 py-4 bg-slate-900/40 border border-white/10 rounded-xl text-white text-base font-inherit outline-none transition-all duration-300 focus:border-blue-400/80 focus:bg-slate-900/80 focus:shadow-[0_0_0_4px_rgba(96,165,250,0.1)] valid:border-blue-400/80 valid:bg-slate-900/80"
            />
            <label
              htmlFor="machineName"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-all duration-300 text-[15px] peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:rounded peer-focus:translate-y-0 peer-valid:-top-2.5 peer-valid:left-3 peer-valid:text-xs peer-valid:text-blue-400 peer-valid:bg-slate-900 peer-valid:px-2 peer-valid:rounded peer-valid:translate-y-0"
            >
              Machine Name
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 px-6 py-4 bg-gradient-to-br from-blue-500 to-purple-500 border-none rounded-xl text-white font-semibold text-base cursor-pointer relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_15px_25px_-10px_rgba(139,92,246,0.6)] active:translate-y-px shadow-[0_10px_20px_-10px_rgba(139,92,246,0.5)] group/btn"
          >
            <span className="relative z-10">Register Machine</span>
            <div className="absolute top-0 -translate-x-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 z-0 group-hover/btn:animate-[spin_3s_infinite]"></div>
          </button>
        </form>
      </div>

      {/* Background decoration elements */}
      <div className="absolute rounded-full blur-[80px] z-0 opacity-60 w-[400px] h-[400px] bg-blue-500 -top-[100px] -left-[100px] animate-pulse"></div>
      <div className="absolute rounded-full blur-[80px] z-0 opacity-60 w-[300px] h-[300px] bg-pink-500 -bottom-[50px] -right-[50px] animate-pulse [animation-delay:2s]"></div>
      <div className="absolute rounded-full blur-[80px] z-0 opacity-60 w-[250px] h-[250px] bg-purple-500 top-[40%] left-[60%] animate-pulse [animation-delay:4s]"></div>
    </div>
  );
};

export default Shed2MachineForm;

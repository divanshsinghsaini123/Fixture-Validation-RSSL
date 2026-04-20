import React, { useState } from 'react';

const Shed2MachineForm: React.FC = () => {
  const [formData, setFormData] = useState({
    hollowShaftLine: '',
    machineNumber: '',
    model: '',
    machineName: ''
  });
  const [checkSheetTemplate, setCheckSheetTemplate] = useState<any[]>([]);
  const [newRow, setNewRow] = useState({
    sNo: '',
    contents: '',
    specification: '',
    inscription: '',
    evaluation: '',
    frequency: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRow(prev => ({ ...prev, [name]: value }));
  };

  const addRow = () => {
    if (newRow.sNo && newRow.contents) {
      setCheckSheetTemplate(prev => [...prev, newRow]);
      setNewRow({
        sNo: '',
        contents: '',
        specification: '',
        inscription: '',
        evaluation: '',
        frequency: ''
      });
    }
  };

  const removeRow = (index: number) => {
    setCheckSheetTemplate(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const token = localStorage.getItem('access_token');

      if (formData.machineName.trim() === '' && formData.machineNumber.trim() === '' && formData.model.trim() === '') {
        alert("Please Enter one of the following - MachineNumber OR MachineName OR Model")
        return;
      }
      const sanitizedData = {
        hollowShaftLine: formData.hollowShaftLine.trim().toLowerCase(),
        machineNumber: formData.machineNumber.trim(),
        model: formData.model.trim(),
        machineName: formData.machineName.trim(),
        checkSheetTemplate: checkSheetTemplate
      };

      const response = await fetch(`${backendUrl}/api/shed2machine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sanitizedData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Machine Registered Successfully!');
        console.log('Backend response:', result);

        // Reset form after successful submission
        setFormData({
          hollowShaftLine: '',
          machineNumber: '',
          model: '',
          machineName: ''
        });
        setCheckSheetTemplate([]);
      } else {
        alert('Failed to register machine. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error connecting to the backend server.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans text-slate-50">

      {/* Background ambient lights */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center overflow-hidden">
        <div className="absolute top-[-10%] md:top-[-20%] left-[-10%] w-64 md:w-96 h-64 md:h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[80px] md:blur-[120px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-10%] md:bottom-[-20%] right-[-10%] w-64 md:w-96 h-64 md:h-96 bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[80px] md:blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Form Card */}
      <div className="relative w-full max-w-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-6 sm:p-10 shadow-2xl z-10 animate-in slide-in-from-bottom-6 fade-in duration-700">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Shed2 Machine Registration
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base px-4">
            Initialize and register a new machine configuration to your fleet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Field: Hollow Shaft Line */}
            <div className="flex flex-col gap-2 group">
              <label htmlFor="hollowShaftLine" className="text-sm font-medium text-slate-300 ml-1 transition-colors group-focus-within:text-indigo-400">
                Line <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="hollowShaftLine"
                  id="hollowShaftLine"
                  value={formData.hollowShaftLine}
                  onChange={handleChange}
                  required
                  placeholder="E.g. Line A-4"
                  className="w-full px-4 py-3 sm:py-3.5 bg-slate-950/50 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Field: Machine Number */}
            <div className="flex flex-col gap-2 group">
              <label htmlFor="machineNumber" className="text-sm font-medium text-slate-300 ml-1 transition-colors group-focus-within:text-indigo-400">
                Machine Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="machineNumber"
                  id="machineNumber"
                  value={formData.machineNumber}
                  onChange={handleChange}
                  placeholder="E.g. MCH-9021"
                  className="w-full px-4 py-3 sm:py-3.5 bg-slate-950/50 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Field: Model */}
            <div className="flex flex-col gap-2 group">
              <label htmlFor="model" className="text-sm font-medium text-slate-300 ml-1 transition-colors group-focus-within:text-indigo-400">
                Model <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="model"
                  id="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="E.g. VX-Elite"
                  className="w-full px-4 py-3 sm:py-3.5 bg-slate-950/50 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Field: Machine Name */}
            <div className="flex flex-col gap-2 group">
              <label htmlFor="machineName" className="text-sm font-medium text-slate-300 ml-1 transition-colors group-focus-within:text-indigo-400">
                Machine Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="machineName"
                  id="machineName"
                  value={formData.machineName}
                  onChange={handleChange}
                  placeholder="E.g. Primary Axis Mill"
                  className="w-full px-4 py-3 sm:py-3.5 bg-slate-950/50 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Check Sheet Template Section */}
          <div className="pt-6 border-t border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0115.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
              </svg>
              Machine Check Sheet Template
            </h3>

            <div className="overflow-x-auto mb-6 rounded-xl border border-slate-700/50">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/50 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-semibold">S.No</th>
                    <th className="px-4 py-3 font-semibold">Contents</th>
                    <th className="px-4 py-3 font-semibold">Specification</th>
                    <th className="px-4 py-3 font-semibold">Inscription</th>
                    <th className="px-4 py-3 font-semibold">Evaluation</th>
                    <th className="px-4 py-3 font-semibold">Freq.</th>
                    <th className="px-4 py-3 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {checkSheetTemplate.map((row, idx) => (
                    <tr key={idx} className="text-slate-200">
                      <td className="px-4 py-3">{row.sNo}</td>
                      <td className="px-4 py-3">{row.contents}</td>
                      <td className="px-4 py-3">{row.specification}</td>
                      <td className="px-4 py-3">{row.inscription}</td>
                      <td className="px-4 py-3">{row.evaluation}</td>
                      <td className="px-4 py-3">{row.frequency}</td>
                      <td className="px-4 py-3 text-center">
                        <button type="button" onClick={() => removeRow(idx)} className="text-rose-400 hover:text-rose-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {checkSheetTemplate.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500 italic">
                        No rows added yet. Define your machine inspection template below.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Row Builder Inputs */}
            <div className="bg-slate-950/30 p-4 rounded-2xl border border-slate-700/30 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <input type="text" name="sNo" value={newRow.sNo} onChange={handleRowChange} placeholder="S.No" className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                <input type="text" name="contents" value={newRow.contents} onChange={handleRowChange} placeholder="Contents" className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                <input type="text" name="specification" value={newRow.specification} onChange={handleRowChange} placeholder="Specification" className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                <input type="text" name="inscription" value={newRow.inscription} onChange={handleRowChange} placeholder="Inscription" className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                <input type="text" name="evaluation" value={newRow.evaluation} onChange={handleRowChange} placeholder="Evaluation" className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                <input type="text" name="frequency" value={newRow.frequency} onChange={handleRowChange} placeholder="Freq." className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Row to Template
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 hover:from-indigo-400 to-fuchsia-600 hover:to-fuchsia-500 border border-indigo-500/30 text-white font-semibold text-lg sm:text-base py-3.5 sm:py-4 px-6 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="flex items-center justify-center gap-2 relative z-10">
                <span>Register Machine</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute inset-0 h-full w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out skew-x-12 z-0"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Shed2MachineForm;

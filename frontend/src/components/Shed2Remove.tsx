import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

export default function Shed2Remove() {
    const navigate = useNavigate();
    const [lines, setLines] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    
    // Toast state
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    
    // Modal state
    const [lineToDelete, setLineToDelete] = useState<string | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchMachines = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${backendUrl}/api/shed2machine/get_all_lines`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setLines(data.lines);
            } else {
                throw new Error('Failed to fetch lines');
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to load machine lines', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteMachineLine = async () => {
        if (!lineToDelete) return;
        
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${backendUrl}/api/shed2machine/remove/${lineToDelete}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                showToast(data.message || 'Line deleted successfully', 'success');
                fetchMachines(); // Refresh the list
            } else {
                throw new Error('Failed to delete line');
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to delete machine line', 'error');
        } finally {
            setLineToDelete(null); // Close modal
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                        title="Go Back"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Remove Shed2 Line
                        </h1>
                        <p className="text-slate-400 mt-1">Delete all machines associated with a specific line</p>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                    </div>
                ) : lines.length === 0 ? (
                    <div className="bg-slate-800 rounded-2xl p-10 text-center border border-slate-700 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="text-xl font-semibold text-slate-300">No lines found</h3>
                        <p className="text-slate-500 mt-2">There are currently no machines registered in the system.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {lines.map((line) => (
                            <div key={line} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex justify-between items-center hover:border-slate-600 hover:shadow-emerald-900/10 hover:shadow-xl transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-700/50 p-3 rounded-lg text-emerald-400 group-hover:bg-slate-700 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{line}</h3>
                                        <p className="text-sm text-slate-400">Machine Line</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setLineToDelete(line)}
                                    className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 p-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                    title="Delete this line"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {lineToDelete && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10 text-red-500 mx-auto mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-center text-white mb-2">Delete Line?</h3>
                        <p className="text-center text-slate-400 mb-6 text-sm leading-relaxed">
                            Are you sure you want to delete <span className="font-bold text-emerald-400">"{lineToDelete}"</span>? This will permanently remove <span className="text-red-400 font-bold underline decoration-red-400/50 underline-offset-2">ALL</span> machines associated with this line. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setLineToDelete(null)}
                                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={deleteMachineLine}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Yes, Delete It
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-md ${
                        toast.type === 'success' 
                            ? 'bg-emerald-900/80 border border-emerald-500/50 text-emerald-100' 
                            : 'bg-red-900/80 border border-red-500/50 text-red-100'
                    }`}>
                        {toast.type === 'success' ? (
                            <div className="bg-emerald-500/20 p-1.5 rounded-full text-emerald-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        ) : (
                            <div className="bg-red-500/20 p-1.5 rounded-full text-red-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        )}
                        <span className="font-semibold tracking-wide">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
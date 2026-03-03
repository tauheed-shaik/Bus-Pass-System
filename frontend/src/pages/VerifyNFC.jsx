import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Scan, CheckCircle2, XCircle, User, MapPin, Calendar, Bus, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const VerifyNFC = () => {
    const [nfcId, setNfcId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!nfcId) return;

        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/nfc/verify/${nfcId}`);
            setResult(res.data);
        } catch (err) {
            toast.error('Verification error');
            setResult({ valid: false, msg: 'System error or invalid ID' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <header className="text-center">
                <div className="bg-primary-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-200 ring-8 ring-white">
                    <Scan className="w-10 h-10 text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Pass Verification</h1>
                <p className="text-slate-500 mt-2">Scan NFC Tag or enter Transit Pass ID manually</p>
            </header>

            <form onSubmit={handleVerify} className="relative group">
                <input
                    type="text"
                    placeholder="NFC-XXXXXXX"
                    className="w-full h-20 pl-16 pr-24 rounded-[2rem] bg-white border-none shadow-2xl text-2xl font-black text-slate-700 outline-none focus:ring-4 focus:ring-primary-500/20 transition-all placeholder:text-slate-200"
                    value={nfcId}
                    onChange={(e) => setNfcId(e.target.value.toUpperCase())}
                    autoFocus
                />
                <Search className="w-8 h-8 text-slate-300 absolute left-6 top-6 group-focus-within:text-primary-500 transition-colors" />
                <button
                    type="submit"
                    className="absolute right-4 top-3 h-14 px-8 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30 flex items-center gap-2 transition-all active:scale-95"
                    disabled={loading}
                >
                    {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Verify'}
                </button>
            </form>

            <AnimatePresence mode="wait">
                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`overflow-hidden rounded-[3rem] shadow-2xl ${result.valid ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                    >
                        <div className="p-10 text-white text-center">
                            <div className="mb-6 flex justify-center">
                                {result.valid ? (
                                    <div className="p-4 bg-white/20 rounded-full animate-bounce">
                                        <CheckCircle2 className="w-16 h-16" />
                                    </div>
                                ) : (
                                    <div className="p-4 bg-white/20 rounded-full animate-pulse">
                                        <XCircle className="w-16 h-16" />
                                    </div>
                                )}
                            </div>
                            <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">
                                {result.valid ? 'Access Granted' : 'Verification Failed'}
                            </h2>
                            <p className="text-white/80 font-medium">{result.msg}</p>

                            {result.pass && (
                                <div className="mt-10 pt-10 border-t border-white/20 text-left space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/10 rounded-2xl">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-white/60 block">Student</span>
                                            <span className="text-xl font-bold">{result.pass.student.name}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/10 rounded-2xl">
                                            <Bus className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-white/60 block">Route / stop</span>
                                            <span className="text-lg font-bold">{result.pass.applicationDetails.route.routeName} - {result.pass.applicationDetails.stop}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/10 rounded-2xl">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-white/60 block">Valid Until</span>
                                            <span className="text-lg font-bold">{new Date(result.pass.validUntil).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white/10 p-4 text-center">
                            <button
                                onClick={() => { setResult(null); setNfcId(''); }}
                                className="text-white/60 hover:text-white font-bold text-xs uppercase tracking-widest"
                            >
                                Clear Result & Reset
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pt-10 space-y-4">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest text-center">Recent Verifications</h4>
                <div className="space-y-2 opacity-30">
                    <div className="p-4 bg-white rounded-2xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm font-bold">NFC-E722A1</span>
                        </div>
                        <span className="text-xs text-slate-400">2 mins ago</span>
                    </div>
                    <div className="p-4 bg-white rounded-2xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <XCircle className="w-5 h-5 text-rose-500" />
                            <span className="text-sm font-bold">NFC-A91283</span>
                        </div>
                        <span className="text-xs text-slate-400">5 mins ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyNFC;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Bus, Clock, CheckCircle2, XCircle, FileText, Download, QrCode as QrIcon, MapPin, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [pass, setPass] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPass();
    }, []);

    const fetchPass = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/bus-pass/my-pass');
            setPass(res.data);
        } catch (err) {
            toast.error('Failed to fetch pass details');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        try {
            const element = document.getElementById('bus-pass-card');
            if (!element) {
                toast.error('Pass card not found');
                return;
            }

            const canvas = await html2canvas(element, {
                scale: 3,
                backgroundColor: '#ffffff',
                useCORS: true,
                logging: false,
                allowTaint: true,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.getElementById('bus-pass-card');
                    if (el) {
                        el.style.fontFamily = "'Inter', sans-serif";
                    }
                    // Remove all external/Tailwind styles that cause oklch parsing crashes
                    const styles = clonedDoc.querySelectorAll('style, link');
                    styles.forEach(s => s.remove());
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Adjust image size to fit A4 landscape
            const imgProps = pdf.getImageProperties(imgData);
            const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
            const w = imgProps.width * ratio;
            const h = imgProps.height * ratio;

            pdf.addImage(imgData, 'PNG', (pdfWidth - w) / 2, (pdfHeight - h) / 2, w, h);
            pdf.save(`BusPass_${user.name}.pdf`);
            toast.success('Bus pass downloaded successfully');
        } catch (err) {
            console.error('PDF Export Error:', err);
            toast.error('Failed to generate PDF. Please try again.');
        }
    };

    if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-primary-600" /></div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Student Portal</h1>
                    <p className="text-slate-500">Welcome back, {user.name}</p>
                </div>
                {!pass && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="btn-primary"
                        onClick={() => window.location.href = '/apply'}
                    >
                        Apply for New Pass
                    </motion.button>
                )}
            </header>

            {!pass ? (
                <div className="p-12 text-center glass-morphism rounded-3xl border-dashed border-2 border-slate-300">
                    <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bus className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800">No Active Pass</h3>
                    <p className="text-slate-500 max-w-md mx-auto mt-2">
                        You haven't applied for a bus pass yet. Start your application today to enjoy easy campus transit.
                    </p>
                    <button
                        className="mt-6 text-primary-600 font-bold hover:underline"
                        onClick={() => window.location.href = '/apply'}
                    >
                        Apply Now &rarr;
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Status Overview */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="glass-morphism rounded-2xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                {pass.status === 'approved' && <CheckCircle2 className="w-8 h-8 text-green-500" />}
                                {pass.status === 'pending' && <Clock className="w-8 h-8 text-amber-500" />}
                                {pass.status === 'rejected' && <XCircle className="w-8 h-8 text-red-500" />}
                            </div>

                            <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary-600" />
                                Application Status
                            </h4>

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${pass.status === 'approved' ? 'bg-green-100 text-green-700' :
                                    pass.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {pass.status}
                                </div>
                                <span className="text-sm text-slate-500">Applied on {new Date(pass.createdAt).toLocaleDateString()}</span>
                            </div>

                            {pass.aiSummary && (
                                <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 mb-6">
                                    <h5 className="text-sm font-bold text-primary-800 flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4" />
                                        AI Analysis
                                    </h5>
                                    <p className="text-slate-700 italic text-sm">"{pass.aiSummary}"</p>
                                </div>
                            )}

                            {pass.adminRemarks && (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Admin Remarks</span>
                                    <p className="text-slate-700 mt-1">{pass.adminRemarks}</p>
                                </div>
                            )}
                        </section>

                        {pass.status === 'approved' && (
                            <>
                                <section
                                    id="bus-pass-card"
                                    style={{
                                        background: 'linear-gradient(to bottom right, #0284c7, #075985)',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                        borderRadius: '1.5rem',
                                        padding: '2rem',
                                        color: 'white',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                >
                                    <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}>
                                        <Bus style={{ width: '10rem', height: '10rem' }} />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                                        <div>
                                            <h2 style={{ fontSize: '1.875rem', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.05em' }}>CAMPUS PASS</h2>
                                            <p style={{ fontWeight: 500, color: '#e0f2fe' }}>Official Transportation Permit</p>
                                        </div>
                                        <div style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: '0.75rem' }}>
                                            <img src={pass.qrCode} alt="QR" style={{ width: '5rem', height: '5rem' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                                        <div>
                                            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', color: '#bae6fd' }}>Student Name</span>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{user.name}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', color: '#bae6fd' }}>Pass ID</span>
                                            <span style={{ fontSize: '1.25rem', fontFamily: 'monospace' }}>{pass.nfcTagId || 'TRANS-PENDING'}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', color: '#bae6fd' }}>Route / Stop</span>
                                            <span style={{ fontWeight: 600 }}>{pass.applicationDetails.route?.routeName || 'N/A'} - {pass.applicationDetails.stop}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', color: '#bae6fd' }}>Valid Until</span>
                                            <span style={{ fontWeight: 600, textDecoration: 'underline', textDecorationThickness: '2px', textDecorationColor: '#fbbf24', textUnderlineOffset: '4px' }}>
                                                {new Date(pass.validUntil).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid rgba(14, 165, 233, 0.5)' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', backgroundColor: '#4ade80' }} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#e0f2fe' }}>SYSTEM VERIFIED</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: '#bae6fd' }}>
                                            <QrIcon style={{ width: '1rem', height: '1rem' }} />
                                            <span>SECURE PASS</span>
                                        </div>
                                    </div>
                                </section>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={downloadPDF}
                                    className="w-full mt-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center gap-3 text-white font-bold transition-all shadow-xl"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Digital Pass (PDF)
                                </motion.button>
                            </>
                        )}
                    </div>

                    <aside className="space-y-6">
                        <div className="glass-morphism rounded-2xl p-6">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                                <MapPin className="w-4 h-4 text-primary-600" />
                                Bus Route Info
                            </h4>
                            {pass.applicationDetails.route ? (
                                <div className="space-y-4">
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <span className="text-xs text-slate-400 block">Active Route</span>
                                        <span className="font-bold text-slate-700">{pass.applicationDetails.route.routeName}</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <span className="text-xs text-slate-400 block">Your Stop</span>
                                        <span className="font-bold text-slate-700">{pass.applicationDetails.stop}</span>
                                    </div>
                                    <div className="border-l-2 border-primary-100 ml-4 pl-4 space-y-4">
                                        {pass.applicationDetails.route.stops.map((s, idx) => (
                                            <div key={idx} className={`relative ${s.stopName === pass.applicationDetails.stop ? 'text-primary-600' : 'text-slate-400'}`}>
                                                <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${s.stopName === pass.applicationDetails.stop ? 'bg-primary-600 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-slate-300'}`} />
                                                <span className="text-sm font-bold block leading-none">{s.stopName}</span>
                                                <span className="text-[10px]">{s.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic">Route details will appear after application.</p>
                            )}
                        </div>

                        <div className="bg-indigo-900 rounded-2xl p-6 text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <QrIcon className="w-20 h-20" />
                            </div>
                            <h4 className="font-bold mb-2">Digital NFC Key</h4>
                            <p className="text-xs text-indigo-200 mb-4">Your pass is automatically linked to your student ID. Staff can scan your ID for verification.</p>
                            <div className="flex justify-center p-4 bg-white rounded-xl mb-4">
                                <QrIcon className="w-16 h-16 text-indigo-900" />
                            </div>
                            <button className="w-full py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-sm font-bold transition-all">
                                NFC Tag Mapping Guide
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;

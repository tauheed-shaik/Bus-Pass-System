import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, FileCheck, Clock, Layers, Map, Eye, CheckCircle2, XCircle,
    MessageSquare, Calendar, RefreshCw, BarChart3, TrendingUp, Search, ExternalLink, ShieldAlert, FileOutput, Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [applications, setApplications] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [students, setStudents] = useState([]);
    const [activeTab, setActiveTab] = useState('applications');
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [decision, setDecision] = useState({ status: '', remarks: '', validMonths: 1 });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, appsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats'),
                axios.get('http://localhost:5000/api/bus-pass/applications')
            ]);
            setStats(statsRes.data);
            setApplications(appsRes.data);

            if (activeTab === 'logs') {
                const logsRes = await axios.get('http://localhost:5000/api/admin/audit-logs');
                setAuditLogs(logsRes.data);
            }
            if (activeTab === 'users') {
                const usersRes = await axios.get('http://localhost:5000/api/admin/users');
                setStudents(usersRes.data);
            }
        } catch (err) {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (e) => {
        e.preventDefault();
        const validFrom = new Date();
        const validUntil = new Date();
        validUntil.setMonth(validUntil.getMonth() + parseInt(decision.validMonths));

        try {
            await axios.put(`http://localhost:5000/api/bus-pass/decision/${selectedApp._id}`, {
                ...decision,
                validFrom,
                validUntil
            });
            toast.success('Application updated');
            setSelectedApp(null);
            fetchData();
        } catch (err) {
            toast.error('Failed to update application');
        }
    };

    const handleBlacklist = async (id) => {
        if (!window.confirm('Are you sure you want to blacklist this pass?')) return;
        try {
            await axios.put(`http://localhost:5000/api/admin/blacklist/${id}`);
            toast.success('Pass blacklisted');
            fetchData();
        } catch (err) {
            toast.error('Failed to blacklist');
        }
    };

    if (loading && !stats) return <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-primary-600" /></div>;

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Controls</h1>
                    <p className="text-slate-500 font-medium">Administration & Transit Management</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => window.open('http://localhost:5000/api/admin/reports?type=applications')} className="p-4 glass-morphism rounded-2xl flex items-center gap-4 shadow-lg border-l-4 border-l-indigo-500">
                        <FileOutput className="w-6 h-6 text-indigo-600" />
                        <div>
                            <span className="block text-[10px] uppercase font-bold text-slate-400">Export Report</span>
                            <span className="text-xs font-bold text-indigo-700">JSON Data</span>
                        </div>
                    </button>
                    <div className="p-4 glass-morphism rounded-2xl flex items-center gap-4 shadow-lg border-l-4 border-l-primary-500">
                        <TrendingUp className="w-6 h-6 text-primary-600" />
                        <div>
                            <span className="block text-[10px] uppercase font-bold text-slate-400">System Uptime</span>
                            <span className="text-xs font-bold text-primary-700">99.9% Optimal</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Applications', value: stats.totalApplications, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Approved Passes', value: stats.approvedPasses, icon: FileCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Pending Approval', value: stats.pendingPasses, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 glass-morphism rounded-3xl shadow-xl border border-slate-100"
                        >
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                            <div className="text-3xl font-black text-slate-800 mt-1">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200">
                {['applications', 'users', 'logs'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 px-6 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {tab}
                        {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full" />}
                    </button>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Content Section */}
                <section className="flex-1 space-y-6">
                    {activeTab === 'applications' && (
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Student</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Route/Type</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {applications.map((app) => (
                                        <tr key={app._id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                                        {app.student?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{app.student?.name || 'N/A'}</div>
                                                        <div className="text-xs text-slate-400">{app.student?.rollNumber}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="font-bold">{app.applicationDetails.route?.routeName || 'Unknown'}</div>
                                                <div className="text-xs text-primary-600">{app.applicationDetails.passType}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${app.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'blacklisted' ? 'bg-black text-white' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button onClick={() => setSelectedApp(app)} className="p-2 bg-primary-50 text-primary-600 rounded-lg"><Eye className="w-4 h-4" /></button>
                                                {app.status === 'approved' && (
                                                    <button onClick={() => handleBlacklist(app._id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><ShieldAlert className="w-4 h-4" /></button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Student Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Email</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Department</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Roll No</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {students.map((s) => (
                                        <tr key={s._id}>
                                            <td className="px-6 py-4 font-bold text-slate-800">{s.name}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{s.email}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{s.department}</td>
                                            <td className="px-6 py-4 font-mono text-xs">{s.rollNumber}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div className="space-y-4">
                            {auditLogs.map((log) => (
                                <div key={log._id} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl"><ShieldAlert className="w-5 h-5 text-slate-400" /></div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">{log.action}</div>
                                        <p className="text-xs text-slate-500 mt-1">{log.details}</p>
                                        <div className="text-[10px] text-slate-400 mt-3 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(log.timestamp).toLocaleString()}
                                            <span className="text-primary-600 font-bold ml-4">BY: {log.adminId?.name || 'System'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Decision Modal (remains same) */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <div className="w-full md:w-1/2 p-10 bg-slate-50 border-r border-slate-100 overflow-y-auto">
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="mb-6 p-2 bg-white rounded-full text-slate-400 shadow-md"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                                <h3 className="text-2xl font-black text-slate-800 mb-8">Application Review</h3>
                                <div className="space-y-6">
                                    <div className="p-4 bg-white rounded-2xl border border-slate-200">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Student Identity</span>
                                        <div className="text-lg font-bold text-slate-800 mt-1">{selectedApp.student?.name}</div>
                                        <div className="text-sm text-slate-500">{selectedApp.student?.rollNumber} | {selectedApp.student?.department}</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        {['idCard', 'feeReceipt', 'addressProof'].map((doc) => (
                                            <a key={doc} href={`http://localhost:5000/${selectedApp.applicationDetails.documents[doc]}`} target="_blank" className="p-2 bg-white border rounded-xl text-center">
                                                <ExternalLink className="w-4 h-4 mx-auto mb-1 text-primary-500" />
                                                <span className="text-[8px] font-black uppercase">{doc}</span>
                                            </a>
                                        ))}
                                    </div>

                                    {selectedApp.aiSummary && (
                                        <div className="p-4 bg-primary-600 text-white rounded-2xl">
                                            <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4" /><span className="text-[10px] font-bold uppercase">AI Summary</span></div>
                                            <p className="text-xs italic">"{selectedApp.aiSummary}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
                                <form onSubmit={handleDecision} className="space-y-6">
                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setDecision({ ...decision, status: 'approved' })} className={`flex-1 p-4 rounded-2xl border-2 transition-all ${decision.status === 'approved' ? 'border-primary-500 bg-primary-50' : 'border-slate-100'}`}>Approve</button>
                                        <button type="button" onClick={() => setDecision({ ...decision, status: 'rejected' })} className={`flex-1 p-4 rounded-2xl border-2 transition-all ${decision.status === 'rejected' ? 'border-red-500 bg-red-50' : 'border-slate-100'}`}>Reject</button>
                                    </div>
                                    <textarea className="input-field min-h-[100px] rounded-2xl bg-slate-50 border-none" placeholder="Decision remarks..." value={decision.remarks} onChange={(e) => setDecision({ ...decision, remarks: e.target.value })} required />
                                    {decision.status === 'approved' && (
                                        <select className="input-field rounded-2xl h-12 bg-slate-50 border-none" value={decision.validMonths} onChange={(e) => setDecision({ ...decision, validMonths: e.target.value })}>
                                            <option value="1">1 Month</option>
                                            <option value="6">6 Months</option>
                                            <option value="12">12 Months</option>
                                        </select>
                                    )}
                                    <button type="submit" className="btn-primary w-full h-14 rounded-2xl">Submit Decision</button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;

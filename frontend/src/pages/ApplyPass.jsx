import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, MapPin, FileUp, ShieldCheck, CreditCard, Sparkles, RefreshCw, Send } from 'lucide-react';
import { toast } from 'react-toastify';

const ApplyPass = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        routeId: '',
        stop: '',
        passType: 'monthly',
        idCard: null,
        feeReceipt: null,
        addressProof: null
    });

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/routes');
            setRoutes(res.data);
        } catch (err) {
            toast.error('Failed to load routes');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Manual Validation for files
        if (!formData.idCard || !formData.feeReceipt || !formData.addressProof) {
            toast.error('Please upload all required documents');
            return;
        }

        setSubmitting(true);

        const data = new FormData();
        data.append('route', formData.routeId);
        data.append('stop', formData.stop);
        data.append('passType', formData.passType);
        data.append('idCard', formData.idCard);
        data.append('feeReceipt', formData.feeReceipt);
        data.append('addressProof', formData.addressProof);

        try {
            await axios.post('http://localhost:5000/api/bus-pass/apply', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Application submitted successfully!');
            navigate('/');
        } catch (err) {
            toast.error('Application failed');
        } finally {
            setSubmitting(false);
        }
    };

    const selectedRouteObj = routes.find(r => r._id === formData.routeId);

    if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-primary-600" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Apply for Transit Pass</h1>
                <p className="text-slate-500">Fill in the details and upload documents for verification.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="glass-morphism rounded-3xl p-8 shadow-xl">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Bus className="w-5 h-5 text-primary-600" />
                        Route Selection
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Select Route</label>
                            <select
                                className="input-field"
                                value={formData.routeId}
                                onChange={(e) => setFormData({ ...formData, routeId: e.target.value, stop: '' })}
                                required
                            >
                                <option value="">Choose a route...</option>
                                {routes.map(r => <option key={r._id} value={r._id}>{r.routeName}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Preferred Stop</label>
                            <select
                                className="input-field"
                                value={formData.stop}
                                onChange={(e) => setFormData({ ...formData, stop: e.target.value })}
                                disabled={!formData.routeId}
                                required
                            >
                                <option value="">{formData.routeId ? 'Choose a stop...' : 'Select route first'}</option>
                                {selectedRouteObj?.stops.map((s, idx) => <option key={idx} value={s.stopName}>{s.stopName} ({s.time})</option>)}
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-600">Pass Duration</label>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                                {['monthly', 'semester', 'yearly'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, passType: type })}
                                        className={`py-3 rounded-xl border-2 transition-all font-bold capitalize ${formData.passType === type
                                            ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-md'
                                            : 'border-slate-100 bg-white text-slate-400 opacity-60'
                                            }`}
                                    >
                                        {type}
                                        {selectedRouteObj && (
                                            <span className="block text-xs mt-1">₹{selectedRouteObj.pricing[type]}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="glass-morphism rounded-3xl p-8 shadow-xl">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <FileUp className="w-5 h-5 text-primary-600" />
                        Document Upload
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'idCard', label: 'College ID Card', icon: ShieldCheck },
                            { name: 'feeReceipt', label: 'Tuition Fee Receipt', icon: CreditCard },
                            { name: 'addressProof', label: 'Address Proof (Aadhaar/Utility)', icon: MapPin }
                        ].map((doc) => (
                            <div key={doc.name} className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600">{doc.label}</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        name={doc.name}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id={`file-${doc.name}`}
                                        accept="image/*,.pdf"
                                    />
                                    <label
                                        htmlFor={`file-${doc.name}`}
                                        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${formData[doc.name]
                                            ? 'border-green-400 bg-green-50'
                                            : 'border-slate-200 hover:border-primary-400 hover:bg-primary-50/50'
                                            }`}
                                    >
                                        <doc.icon className={`w-8 h-8 mb-2 ${formData[doc.name] ? 'text-green-500' : 'text-slate-400 group-hover:text-primary-500'}`} />
                                        <span className="text-[10px] text-center font-bold text-slate-500 group-hover:text-primary-600">
                                            {formData[doc.name] ? formData[doc.name].name : 'Browse Files'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-xs font-medium">
                        <Sparkles className="w-4 h-4" />
                        AI will analyze your documents for consistency to speed up approval.
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`btn-primary w-full max-w-md h-14 text-lg flex items-center justify-center gap-3 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? (
                            <RefreshCw className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-6 h-6" />
                                Submit Application
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplyPass;

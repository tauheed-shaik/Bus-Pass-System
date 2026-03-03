import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Map, Plus, Trash2, Clock, MapPin, Save, RefreshCw, IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';

const ManageRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRoute, setNewRoute] = useState({
        routeName: '',
        stops: [{ stopName: '', time: '' }],
        pricing: { monthly: 0, semester: 0, yearly: 0 }
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

    const addStop = () => {
        setNewRoute({ ...newRoute, stops: [...newRoute.stops, { stopName: '', time: '' }] });
    };

    const handleStopChange = (index, field, value) => {
        const updatedStops = [...newRoute.stops];
        updatedStops[index][field] = value;
        setNewRoute({ ...newRoute, stops: updatedStops });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/routes', newRoute);
            toast.success('Route added successfully');
            setNewRoute({
                routeName: '',
                stops: [{ stopName: '', time: '' }],
                pricing: { monthly: 0, semester: 0, yearly: 0 }
            });
            fetchRoutes();
        } catch (err) {
            toast.error('Failed to add route');
        }
    };

    const deleteRoute = async (id) => {
        if (!window.confirm('Are you sure you want to delete this route?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/routes/${id}`);
            toast.success('Route deleted');
            fetchRoutes();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    if (loading) return <div className="flex justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-primary-600" /></div>;

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Route Management</h1>
                <p className="text-slate-500">Add and modify campus bus routes and stops.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Route Creation Form */}
                <section className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="glass-morphism rounded-3xl p-8 shadow-xl sticky top-24 space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary-600" />
                            New Route
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Route Name</label>
                                <input
                                    type="text"
                                    className="input-field mt-1"
                                    placeholder="e.g. South Campus Express"
                                    value={newRoute.routeName}
                                    onChange={(e) => setNewRoute({ ...newRoute, routeName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                                    Stops & Schedule
                                    <button type="button" onClick={addStop} className="text-primary-600 lowercase">+ add stop</button>
                                </label>
                                {newRoute.stops.map((stop, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Stop"
                                            className="input-field flex-1 text-sm h-10"
                                            value={stop.stopName}
                                            onChange={(e) => handleStopChange(idx, 'stopName', e.target.value)}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="8:00 AM"
                                            className="input-field w-24 text-sm h-10"
                                            value={stop.time}
                                            onChange={(e) => handleStopChange(idx, 'time', e.target.value)}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pricing (INR)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-slate-500">Monthly</span>
                                        <input type="number" className="input-field text-sm h-10" value={newRoute.pricing.monthly} onChange={(e) => setNewRoute({ ...newRoute, pricing: { ...newRoute.pricing, monthly: e.target.value } })} required />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-slate-500">Semester</span>
                                        <input type="number" className="input-field text-sm h-10" value={newRoute.pricing.semester} onChange={(e) => setNewRoute({ ...newRoute, pricing: { ...newRoute.pricing, semester: e.target.value } })} required />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-slate-500">Yearly</span>
                                        <input type="number" className="input-field text-sm h-10" value={newRoute.pricing.yearly} onChange={(e) => setNewRoute({ ...newRoute, pricing: { ...newRoute.pricing, yearly: e.target.value } })} required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                            <Save className="w-5 h-5" />
                            Save Route
                        </button>
                    </form>
                </section>

                {/* Route List */}
                <section className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Map className="w-6 h-6 text-primary-600" />
                        Active Routes
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {routes.map((route) => (
                            <motion.div
                                layout
                                key={route._id}
                                className="glass-morphism rounded-3xl p-6 shadow-lg border border-slate-100 flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 leading-tight">{route.routeName}</h3>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-xs font-bold text-primary-600 flex items-center gap-1">
                                                <IndianRupee className="w-3 h-3" />
                                                {route.pricing.monthly}/mo
                                            </span>
                                            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                                                {route.stops.length} stops
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteRoute(route._id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-3 mt-4 flex-1">
                                    {route.stops.map((stop, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-primary-500' : 'bg-slate-300'}`} />
                                                {idx !== route.stops.length - 1 && <div className="w-0.5 h-6 bg-slate-100" />}
                                            </div>
                                            <div className="flex-1 flex justify-between">
                                                <span className="text-sm font-medium text-slate-600">{stop.stopName}</span>
                                                <span className="text-xs font-bold text-slate-400">{stop.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ManageRoutes;

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus, User, Mail, Lock, CreditCard, BookOpen, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        rollNumber: '',
        department: '',
        phoneNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup(formData);
            toast.success('Registration successful!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl p-8 glass-morphism rounded-3xl shadow-2xl"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="p-4 bg-primary-100 rounded-2xl mb-4 shadow-inner">
                        <UserPlus className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Student Registration</h2>
                    <p className="text-slate-500 mt-2">Create your account to apply for a transit pass</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                        <div className="input-field-wrapper">
                            <input type="text" name="name" className="input-field" placeholder="John Doe" onChange={handleChange} required />
                            <User className="input-icon" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                        <div className="input-field-wrapper">
                            <input type="email" name="email" className="input-field" placeholder="john@college.edu" onChange={handleChange} required />
                            <Mail className="input-icon" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                        <div className="input-field-wrapper">
                            <input type="password" name="password" className="input-field" placeholder="••••••••" onChange={handleChange} required />
                            <Lock className="input-icon" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Roll Number</label>
                        <div className="input-field-wrapper">
                            <input type="text" name="rollNumber" className="input-field" placeholder="CS2024001" onChange={handleChange} required />
                            <CreditCard className="input-icon" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Department</label>
                        <div className="input-field-wrapper">
                            <input type="text" name="department" className="input-field" placeholder="Computer Science" onChange={handleChange} required />
                            <BookOpen className="input-icon" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                        <div className="input-field-wrapper">
                            <input type="text" name="phoneNumber" className="input-field" placeholder="+91 98765 43210" onChange={handleChange} required />
                            <Phone className="input-icon" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full md:col-span-2 h-14 mt-4">
                        {loading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                        ) : (
                            <>
                                <UserPlus className="w-6 h-6" />
                                <span>Create Student Account</span>
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-10 text-center text-slate-600 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 font-bold hover:underline transition-all">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;

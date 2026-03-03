import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogIn, User, ShieldCheck, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(email, password);
            toast.success(`Welcome back, ${user.name}!`);
            if (user.role === 'admin') navigate('/admin');
            else navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 glass-morphism rounded-3xl shadow-2xl"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 bg-primary-100 rounded-2xl mb-4 shadow-inner">
                        <LogIn className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 mt-2">Sign in to your transit pass portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                        <div className="input-field-wrapper">
                            <input
                                type="email"
                                className="input-field"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail className="input-icon" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-slate-700 ml-1">Password</label>
                        <div className="input-field-wrapper">
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Lock className="input-icon" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full h-12">
                        {loading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-600 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary-600 font-bold hover:underline transition-all">
                            Register here
                        </Link>
                    </p>
                    <div className="mt-6 p-4 bg-amber-50 rounded-2xl text-[11px] text-amber-700 border border-amber-100/50 leading-relaxed shadow-sm">
                        <ShieldCheck className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                        Note: Only students can sign up. Admin credentials are provided by the institution for staff login.
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

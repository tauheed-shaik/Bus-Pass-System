import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bus, LogOut, User, LayoutDashboard, Map, Search } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="p-2 bg-primary-600 rounded-lg">
                        <Bus className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-800 hidden sm:block">Bus Pass Automator</span>
                </Link>

                {user ? (
                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link to={user.role === 'admin' ? '/admin' : '/'} className="flex items-center gap-1 text-slate-600 hover:text-primary-600 font-medium transition-colors">
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="hidden md:block">Dashboard</span>
                        </Link>

                        {user.role === 'admin' ? (
                            <Link to="/admin/routes" className="flex items-center gap-1 text-slate-600 hover:text-primary-600 font-medium transition-colors">
                                <Map className="w-5 h-5" />
                                <span className="hidden md:block">Routes</span>
                            </Link>
                        ) : (
                            <Link to="/apply" className="flex items-center gap-1 text-slate-600 hover:text-primary-600 font-medium transition-colors">
                                <Bus className="w-5 h-5" />
                                <span className="hidden md:block">Apply Pass</span>
                            </Link>
                        )}

                        <Link to="/verify-nfc" className="flex items-center gap-1 text-slate-600 hover:text-primary-600 font-medium transition-colors">
                            <Search className="w-5 h-5" />
                            <span className="hidden md:block">Verify</span>
                        </Link>

                        <div className="h-6 w-px bg-slate-200" />

                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end hidden sm:flex">
                                <span className="text-sm font-semibold text-slate-800 leading-none">{user.name}</span>
                                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{user.role}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium">Sign In</Link>
                        <Link to="/signup" className="btn-primary py-1.5">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

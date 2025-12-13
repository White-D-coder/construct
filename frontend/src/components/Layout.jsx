
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Target,
    Clock,
    Users,
    Trophy,
    LogOut,
    Menu,
    X,
    Settings
} from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Goals', path: '/goals', icon: Target },
        { label: 'Sessions', path: '/sessions', icon: Clock },
        { label: 'Partners', path: '/partners', icon: Users },
        { label: 'Achievements', path: '/achievements', icon: Trophy },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-background text-text font-sans flex transition-colors duration-300">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-gray-800 h-screen fixed left-0 top-0 z-20 shadow-2xl">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        S
                    </div>
                    <span className="text-xl font-bold text-white tracking-wide">StudySphere</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items - center gap - 3 px - 4 py - 3 rounded - lg transition - all duration - 200 border ${isActive(item.path)
                                    ? 'bg-white/10 text-white font-semibold border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                                    : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white hover:border-white/10'
                                } `}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold border border-gray-600">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-surface border-b border-gray-800 z-30 px-4 py-3 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold">
                        S
                    </div>
                    <span className="text-lg font-bold text-white">StudySphere</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-400 hover:text-white">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-64 bg-surface border-l border-gray-800 shadow-2xl p-4 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-end mb-4">
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <nav className="space-y-2 flex-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items - center gap - 3 px - 4 py - 3 rounded - lg transition - all duration - 200 border ${isActive(item.path)
                                            ? 'bg-white/10 text-white font-semibold border-white/20'
                                            : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'
                                        } `}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors mt-auto"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-4 md:p-8 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;


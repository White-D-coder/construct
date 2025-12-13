import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Activity, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const [stats, setStats] = useState({ totalUsers: 0, totalSessions: 0 });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Mock fetching admin stats - in real app, create dedicated admin endpoints
        const fetchAdminData = async () => {
            try {
                // Mock data for demonstration
                setStats({ totalUsers: 120, totalSessions: 450 });
                setUsers([
                    { id: 1, username: 'student1', email: 's1@test.com', role: 'public' },
                    { id: 2, username: 'student2', email: 's2@test.com', role: 'public' },
                    { id: 3, username: 'admin_user', email: 'admin@test.com', role: 'admin' },
                ]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAdminData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-background text-text font-sans">
            <nav className="bg-surface border-b border-gray-700 p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-xl text-white">
                        <Shield size={24} className="text-red-500" />
                        <span>StudySphere Admin</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300">
                        <span>Welcome, {user?.username}</span>
                        <button onClick={logout} className="flex items-center gap-2 hover:text-red-400 transition">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <motion.div
                className="container mx-auto p-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.h1 variants={itemVariants} className="text-3xl font-bold text-white mb-8">System Overview</motion.h1>

                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-surface p-6 rounded-xl shadow-lg border border-gray-700 border-l-4 border-l-primary-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-400 text-sm uppercase font-semibold">Total Users</p>
                                <h2 className="text-3xl font-bold text-white">{stats.totalUsers}</h2>
                            </div>
                            <div className="p-3 bg-primary-500/20 rounded-full text-primary-400">
                                <Users size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface p-6 rounded-xl shadow-lg border border-gray-700 border-l-4 border-l-green-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-400 text-sm uppercase font-semibold">Total Sessions</p>
                                <h2 className="text-3xl font-bold text-white">{stats.totalSessions}</h2>
                            </div>
                            <div className="p-3 bg-green-500/20 rounded-full text-green-400">
                                <Activity size={24} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-surface rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-700">
                        <h3 className="text-xl font-bold text-white">User Management</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Username</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-400">#{u.id}</td>
                                    <td className="px-6 py-4 font-medium text-white">{u.username}</td>
                                    <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;

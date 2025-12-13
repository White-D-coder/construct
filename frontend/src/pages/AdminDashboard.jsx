import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Activity, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const [stats, setStats] = useState({ totalUsers: 0, totalSessions: 0 });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Mock fetching admin stats - in real app, create dedicated admin endpoints
        // For now, we'll just simulate some data or fetch what we can
        const fetchAdminData = async () => {
            try {
                // This endpoint doesn't exist yet, but we'd create it
                // const res = await api.get('/admin/stats'); 
                // setStats(res.data);

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

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-gray-900 text-white p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Shield size={24} className="text-red-500" />
                        <span>StudySphere Admin</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>Welcome, {user?.username}</span>
                        <button onClick={logout} className="flex items-center gap-2 hover:text-red-400 transition">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">System Overview</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-500 text-sm uppercase font-semibold">Total Users</p>
                                <h2 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h2>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                <Users size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-500 text-sm uppercase font-semibold">Total Sessions</p>
                                <h2 className="text-3xl font-bold text-gray-800">{stats.totalSessions}</h2>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full text-green-600">
                                <Activity size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b">
                        <h3 className="text-xl font-bold text-gray-800">User Management</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Username</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-500">#{u.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{u.username}</td>
                                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await api.get('/sessions');
                setSessions(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <Layout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-8"
            >
                <motion.div variants={itemVariants}>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Study History</h1>
                    <p className="text-gray-400 mt-1">Track your focus sessions over time.</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-surface rounded-xl shadow-lg border border-gray-800 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading sessions...</div>
                    ) : sessions.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No sessions recorded yet. Start focusing!</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-900/50 border-b border-gray-800">
                                    <tr>
                                        <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Date</th>
                                        <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Duration</th>
                                        <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {sessions.map((session) => (
                                        <tr key={session._id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-white flex items-center gap-2">
                                                <Calendar size={16} className="text-gray-500" />
                                                {new Date(session.startTime).toLocaleDateString()}
                                                <span className="text-gray-500 text-xs ml-1">
                                                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </td>
                                            <td className="p-4 text-white">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-gray-500" />
                                                    {session.duration} min
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-400 italic">
                                                {session.notes || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </Layout>
    );
};

export default Sessions;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Layout from '../components/Layout';
import Timer from '../components/Timer';
import StatsCard from '../components/StatsCard';
import AnalyticsChart from '../components/AnalyticsChart';
import GoalList from '../components/GoalList';
import FeedbackCard from '../components/FeedbackCard';
import { Plus, Flame, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ streak: 0, totalHours: 0, totalSessions: 0 });
    const [sessions, setSessions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, goalsRes, sessionsRes] = await Promise.all([
                    api.get('/sessions/stats'),
                    api.get('/goals'),
                    api.get('/sessions')
                ]);
                setStats(statsRes.data);
                setGoals(goalsRes.data);
                setSessions(sessionsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSessionComplete = () => {
        // Refresh stats and sessions after a session
        api.get('/sessions/stats').then(res => setStats(res.data));
        api.get('/sessions').then(res => setSessions(res.data));
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-gray-400">Loading...</div>;

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
        <Layout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Greeting Section */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Good morning, <span className="text-gray-300">{user?.username}</span>.
                    </h1>
                    <p className="text-gray-500 mt-1">Focus mode engaged.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Timer */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Cards */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-surface p-6 rounded-xl shadow-lg border border-gray-800 flex items-center gap-4 hover:border-gray-600 transition-colors">
                                <div className="p-3 bg-white/5 text-white rounded-lg border border-white/10">
                                    <Flame size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Streak</p>
                                    <p className="text-2xl font-bold text-white">{stats.streak} Days</p>
                                </div>
                            </div>
                            <div className="bg-surface p-6 rounded-xl shadow-lg border border-gray-800 flex items-center gap-4 hover:border-gray-600 transition-colors">
                                <div className="p-3 bg-white/5 text-white rounded-lg border border-white/10">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Hours</p>
                                    <p className="text-2xl font-bold text-white">{Number(stats.totalHours).toFixed(1)}h</p>
                                </div>
                            </div>
                            <div className="bg-surface p-6 rounded-xl shadow-lg border border-gray-800 flex items-center gap-4 hover:border-gray-600 transition-colors">
                                <div className="p-3 bg-white/5 text-white rounded-lg border border-white/10">
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Sessions</p>
                                    <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Analytics Chart */}
                        <motion.div variants={itemVariants} className="bg-surface p-6 rounded-xl shadow-lg border border-gray-800">
                            <h3 className="text-lg font-bold text-white mb-4">Weekly Activity</h3>
                            <div className="h-64 opacity-80">
                                <AnalyticsChart sessions={sessions} />
                            </div>
                        </motion.div>

                        {/* Goals Section */}
                        <motion.div variants={itemVariants} className="bg-surface p-6 rounded-xl shadow-lg border border-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white">Your Goals</h3>
                                <button className="flex items-center gap-2 text-white font-medium hover:bg-white/10 px-3 py-1.5 rounded-lg transition border border-transparent hover:border-white/20">
                                    <Plus size={18} /> Add Goal
                                </button>
                            </div>
                            <GoalList goals={goals} />
                        </motion.div>
                    </div>

                    {/* Right Column: Timer & Feedback */}
                    <div className="space-y-8">
                        {/* Timer Widget */}
                        <motion.div variants={itemVariants} className="bg-surface p-6 rounded-xl shadow-lg border border-gray-800 sticky top-8">
                            <h3 className="text-lg font-bold text-white mb-4">Focus Timer</h3>
                            <Timer onSessionComplete={handleSessionComplete} />
                        </motion.div>

                        {/* AI Feedback */}
                        <motion.div variants={itemVariants}>
                            <FeedbackCard />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </Layout>
    );
};

export default Dashboard;

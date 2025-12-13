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

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ streak: 0, totalHours: 0, totalSessions: 0 });
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, goalsRes] = await Promise.all([
                    api.get('/sessions/stats'),
                    api.get('/goals')
                ]);
                setStats(statsRes.data);
                setGoals(goalsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSessionComplete = () => {
        // Refresh stats after a session
        api.get('/sessions/stats').then(res => setStats(res.data));
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-primary-600">Loading...</div>;

    return (
        <Layout>
            {/* Greeting Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Good morning, <span className="text-primary-600">{user?.username}</span>! 👋
                </h1>
                <p className="text-gray-500 mt-1">Ready to crush your goals today?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Timer */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                                <Flame size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Current Streak</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.streak} Days</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Hours</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalHours.toFixed(1)}h</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Sessions</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Activity</h3>
                        <div className="h-64">
                            <AnalyticsChart />
                        </div>
                    </div>

                    {/* Goals Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Your Goals</h3>
                            <button className="flex items-center gap-2 text-primary-600 font-medium hover:bg-primary-50 px-3 py-1.5 rounded-lg transition">
                                <Plus size={18} /> Add Goal
                            </button>
                        </div>
                        <GoalList goals={goals} />
                    </div>
                </div>

                {/* Right Column: Timer & Feedback */}
                <div className="space-y-8">
                    {/* Timer Widget */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Focus Timer</h3>
                        <Timer onSessionComplete={handleSessionComplete} />
                    </div>

                    {/* AI Feedback */}
                    <FeedbackCard />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;

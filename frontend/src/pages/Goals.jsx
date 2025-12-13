import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import GoalList from '../components/GoalList';
import GoalForm from '../components/GoalForm';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchGoals = async () => {
        try {
            const res = await api.get('/goals');
            setGoals(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
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
                <motion.div variants={itemVariants} className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Goals</h1>
                        <p className="text-gray-400 mt-1">Set targets and crush them.</p>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    >
                        <Plus size={20} /> New Goal
                    </button>
                </motion.div>

                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <GoalForm onGoalAdded={fetchGoals} onClose={() => setIsFormOpen(false)} />
                    </motion.div>
                )}

                <motion.div variants={itemVariants} className="bg-surface p-6 rounded-xl shadow-lg border border-gray-800">
                    {loading ? (
                        <div className="text-center text-gray-500 py-8">Loading goals...</div>
                    ) : (
                        <GoalList goals={goals} />
                    )}
                </motion.div>
            </motion.div>
        </Layout>
    );
};

export default Goals;

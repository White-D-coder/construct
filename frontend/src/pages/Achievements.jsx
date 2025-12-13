import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { Trophy, Lock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Achievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const res = await api.get('/gamification');
                setAchievements(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
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
                    <h1 className="text-3xl font-bold text-white tracking-tight">Achievements</h1>
                    <p className="text-gray-400 mt-1">Badges earned through consistency.</p>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center text-gray-500 py-8">Loading achievements...</div>
                    ) : achievements.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-8">No achievements yet. Keep studying!</div>
                    ) : (
                        achievements.map((achievement) => (
                            <div key={achievement.id} className="bg-surface p-6 rounded-xl border border-gray-800 hover:border-gray-600 transition-colors flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center border ${achievement.unlocked ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-900 border-gray-800 text-gray-700'
                                    }`}>
                                    {achievement.unlocked ? <Trophy size={32} /> : <Lock size={32} />}
                                </div>
                                <div>
                                    <h3 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-600'}`}>
                                        {achievement.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">{achievement.description}</p>
                                    {achievement.unlocked && (
                                        <span className="inline-flex items-center gap-1 text-xs text-white mt-2 bg-white/10 px-2 py-0.5 rounded-full">
                                            <Star size={10} fill="currentColor" /> Unlocked
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>
            </motion.div>
        </Layout>
    );
};

export default Achievements;

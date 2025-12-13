import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background text-text font-sans">
            {/* Navbar */}
            <nav className="flex justify-between items-center p-6 container mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold text-white flex items-center gap-2"
                >
                    <BookOpen size={28} />
                    <span>StudySphere</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-x-4"
                >
                    <Link to="/login" className="text-gray-400 hover:text-white font-medium transition">Login</Link>
                    <Link to="/register" className="px-5 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.2)] font-semibold">
                        Get Started
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <header className="container mx-auto px-6 py-20 text-center md:text-left flex flex-col md:flex-row items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="md:w-1/2 space-y-6"
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tighter">
                        Master Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Study Habits</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-lg">
                        Stay consistent with Pomodoro timers, track your streaks, and find accountability partners.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link to="/register" className="px-8 py-4 bg-white text-black text-lg font-bold rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            Start Studying Now <ArrowRight size={20} />
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="md:w-1/2 mt-12 md:mt-0 relative"
                >
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse"></div>

                    <div className="relative bg-surface p-8 rounded-2xl shadow-2xl border border-gray-800 backdrop-blur-sm">
                        {/* Mock UI Card */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">7 Day Streak!</h3>
                                <p className="text-sm text-gray-400">You're on fire 🔥</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-2 bg-gray-800 rounded-full w-full">
                                <div className="h-2 bg-white rounded-full w-3/4 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Weekly Goal</span>
                                <span>75%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Everything you need to succeed</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        { icon: BookOpen, title: 'Goal Tracking', desc: 'Set clear study goals and track your progress with detailed analytics.' },
                        { icon: Users, title: 'Find Partners', desc: 'Connect with other students who share your subjects and keep each other accountable.' },
                        { icon: Trophy, title: 'Gamification', desc: 'Earn badges, maintain streaks, and climb the leaderboard to stay motivated.' }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="p-8 bg-surface rounded-xl shadow-lg hover:shadow-xl transition border border-gray-800 hover:border-white/20 group"
                        >
                            <div className={`w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-white/10 transition-colors`}>
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                            <p className="text-gray-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

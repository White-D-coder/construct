import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Trophy, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
            {/* Navbar */}
            <nav className="flex justify-between items-center p-6 container mx-auto">
                <div className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                    <BookOpen size={28} />
                    <span>StudySphere</span>
                </div>
                <div className="space-x-4">
                    <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
                    <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="container mx-auto px-6 py-20 text-center md:text-left flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 space-y-6">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                        Master Your Study Habits <span className="text-indigo-600">Together</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        Stay consistent with Pomodoro timers, track your streaks, and find accountability partners to reach your academic goals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link to="/register" className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                            Start Studying Now <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
                <div className="md:w-1/2 mt-12 md:mt-0 relative">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                    <div className="relative bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
                        {/* Mock UI Card */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">7 Day Streak!</h3>
                                <p className="text-sm text-gray-500">You're on fire 🔥</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-2 bg-gray-100 rounded-full w-full">
                                <div className="h-2 bg-indigo-500 rounded-full w-3/4"></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Weekly Goal</span>
                                <span>75%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">Everything you need to succeed</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Goal Tracking</h3>
                        <p className="text-gray-600">Set clear study goals and track your progress with detailed analytics and charts.</p>
                    </div>
                    <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                            <Users size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Find Partners</h3>
                        <p className="text-gray-600">Connect with other students who share your subjects and keep each other accountable.</p>
                    </div>
                    <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                            <Trophy size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Gamification</h3>
                        <p className="text-gray-600">Earn badges, maintain streaks, and climb the leaderboard to stay motivated.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

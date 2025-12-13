import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-white">Login to <span className="text-primary-400">StudySphere</span></h2>
                {error && <p className="text-red-400 mb-4 text-center bg-red-500/10 p-2 rounded">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 bg-background border border-gray-700 rounded-xl text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-background border border-gray-700 rounded-xl text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-500 transition shadow-lg shadow-primary-500/20 mt-2"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-400">
                    Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">Register</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;

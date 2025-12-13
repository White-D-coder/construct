import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/');
        } catch (err) {
            console.error('Registration Error:', err);
            const status = err.response?.status;
            const data = err.response?.data;
            const url = err.config?.url;
            const baseURL = err.config?.baseURL;

            alert(`Debug Error:
            Status: ${status}
            URL: ${url}
            BaseURL: ${baseURL}
            Message: ${data?.msg || err.message}`);

            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-white">Join <span className="text-primary-400">StudySphere</span></h2>
                {error && <p className="text-red-400 mb-4 text-center bg-red-500/10 p-2 rounded">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm font-medium">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-background border border-gray-700 rounded-xl text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="StudentName"
                        />
                    </div>
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
                        Register
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-400">
                    Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;

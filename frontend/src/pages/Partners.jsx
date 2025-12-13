import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { UserPlus, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Partners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const res = await api.get('/partners');
                setPartners(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPartners();
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
                    <h1 className="text-3xl font-bold text-white tracking-tight">Find Partners</h1>
                    <p className="text-gray-400 mt-1">Connect with others and stay accountable.</p>
                </motion.div>

                {/* Search Bar (Mock) */}
                <motion.div variants={itemVariants} className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search for study buddies..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-gray-800 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition placeholder-gray-600"
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center text-gray-500 py-8">Loading partners...</div>
                    ) : partners.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-8">No partners found.</div>
                    ) : (
                        partners.map((partner) => (
                            <div key={partner.id} className="bg-surface p-6 rounded-xl border border-gray-800 hover:border-gray-600 transition-colors flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4 border border-gray-700">
                                    <User size={40} />
                                </div>
                                <h3 className="text-lg font-bold text-white">{partner.username}</h3>
                                <p className="text-sm text-gray-500 mb-6">{partner.email}</p>
                                <button className="w-full py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2">
                                    <UserPlus size={18} /> Connect
                                </button>
                            </div>
                        ))
                    )}
                </motion.div>
            </motion.div>
        </Layout>
    );
};

export default Partners;

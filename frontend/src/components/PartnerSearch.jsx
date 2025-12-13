import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { UserPlus, Search, Check } from 'lucide-react';

const PartnerSearch = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sentRequests, setSentRequests] = useState(new Set());

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

    const sendRequest = async (userId) => {
        try {
            await api.post('/requests', { receiverId: userId });
            setSentRequests(prev => new Set(prev).add(userId));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Error sending request');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search for study partners..."
                    className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                />
            </div>

            <div className="space-y-4">
                {partners.map((partner) => (
                    <div key={partner.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                                {partner.username[0].toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{partner.username}</h4>
                                <p className="text-sm text-gray-500">Looking for accountability</p>
                            </div>
                        </div>
                        <button
                            onClick={() => sendRequest(partner.id)}
                            disabled={sentRequests.has(partner.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${sentRequests.has(partner.id)
                                    ? 'bg-green-100 text-green-700 cursor-default'
                                    : 'bg-primary-600 text-white hover:bg-primary-700'
                                }`}
                        >
                            {sentRequests.has(partner.id) ? (
                                <>
                                    <Check size={16} /> Sent
                                </>
                            ) : (
                                <>
                                    <UserPlus size={16} /> Connect
                                </>
                            )}
                        </button>
                    </div>
                ))}
                {partners.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No new partners found.</p>
                )}
            </div>
        </div>
    );
};

export default PartnerSearch;

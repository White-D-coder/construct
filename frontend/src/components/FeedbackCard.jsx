import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Sparkles, ThumbsUp } from 'lucide-react';

const FeedbackCard = () => {
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await api.get('/feedback');
                setFeedback(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    if (loading || !feedback) return null;

    return (
        <div className="bg-surface p-6 rounded-xl shadow-lg border border-gray-800 text-white relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-10 -translate-y-10"></div>

            <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Sparkles size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">Weekly Insights</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {feedback.message}
                    </p>

                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition flex items-center gap-1 border border-white/10">
                            <ThumbsUp size={14} /> Helpful
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackCard;

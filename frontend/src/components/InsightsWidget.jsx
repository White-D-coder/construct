import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, RefreshCw } from 'lucide-react';
import api from '../api/axios';

const InsightsWidget = () => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(false);

    // We can auto-fetch on mount, or wait for user action. 
    // Given costs/latency, user action is better, or fetch once and cache?
    // Let's do user action for now "Generate Weekly Report".

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const res = await api.get('/insights/weekly');
            setInsight(res.data.insight);
        } catch (err) {
            console.error(err);
            setInsight('Failed to generate insights. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-yellow-400" size={20} />
                    AI Weekly Coach
                </h3>
                <button
                    onClick={fetchInsights}
                    disabled={loading}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition disabled:opacity-50"
                    title="Generate New Report"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="prose prose-invert prose-sm max-w-none">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-3">
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <p>Analyzing your focus data...</p>
                    </div>
                ) : insight ? (
                    <ReactMarkdown>{insight}</ReactMarkdown>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <p>Get a personalized analysis of your weekly progress.</p>
                        <button
                            onClick={fetchInsights}
                            className="mt-4 px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-indigo-50 transition shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        >
                            Generate Insights
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsightsWidget;

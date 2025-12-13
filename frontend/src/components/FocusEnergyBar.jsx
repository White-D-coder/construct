import React from 'react';
import { motion } from 'framer-motion';

const FocusEnergyBar = ({ timeLeft, duration, mode }) => {
    const totalSeconds = duration * 60;
    const progress = Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100);

    // In "break" mode, maybe it fills with a different color?
    // In "FocusQuest" concept, focus "fills" energy.

    return (
        <div className="w-full max-w-md mx-auto mt-4 px-4 relative z-20">
            <div className="flex justify-between text-[10px] font-bold text-white/40 mb-1 uppercase tracking-widest">
                <span>{mode === 'work' ? '⚡ System Power' : '🔋 Recharging'}</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-4 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                <motion.div
                    className={`h-full relative overflow-hidden ${mode === 'work'
                            ? 'bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 shadow-[0_0_15px_rgba(129,140,248,0.5)]'
                            : 'bg-gradient-to-r from-teal-500 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                        }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                >
                    {/* Shimmer Effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer"></div>
                </motion.div>
            </div>
        </div>
    );
};

export default FocusEnergyBar;

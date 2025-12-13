import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import api from '../api/axios';

const Timer = ({ onSessionComplete }) => {
    const [duration, setDuration] = useState(25); // Default 25 mins
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work'); // 'work' or 'break'
    const timerRef = useRef(null);

    const BREAK_TIME = 5 * 60;

    useEffect(() => {
        // Update timeLeft when duration changes, but only if not active
        if (!isActive && mode === 'work') {
            setTimeLeft(duration * 60);
        }
    }, [duration, isActive, mode]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timerRef.current);
            setIsActive(false);
            handleTimerComplete();
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const handleTimerComplete = async () => {
        if (mode === 'work') {
            // Log session
            try {
                await api.post('/sessions', {
                    duration: duration,
                    notes: 'Completed Focus session'
                });
                if (onSessionComplete) onSessionComplete();
                alert("Great job! Time for a break.");
                setMode('break');
                setTimeLeft(BREAK_TIME);
            } catch (err) {
                console.error(err);
            }
        } else {
            alert("Break over! Back to work.");
            setMode('work');
            setTimeLeft(duration * 60);
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'work' ? duration * 60 : BREAK_TIME);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const totalTime = mode === 'work' ? duration * 60 : BREAK_TIME;
    const progress = (totalTime - timeLeft) / totalTime * 100;

    return (
        <div className="flex flex-col items-center">
            {/* Timer Display */}
            <div className="relative w-64 h-64 flex items-center justify-center mb-6">
                {/* Circular Progress Background */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-800"
                    />
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 120}
                        strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                        className={`${mode === 'work' ? 'text-white' : 'text-gray-400'} transition-all duration-1000 ease-linear`}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Time Text */}
                <div className="absolute flex flex-col items-center">
                    <span className={`text-6xl font-bold tabular-nums ${mode === 'work' ? 'text-white' : 'text-gray-400'}`}>
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-gray-500 font-medium mt-2 flex items-center gap-2">
                        {mode === 'work' ? <Brain size={18} /> : <Coffee size={18} />}
                        {mode === 'work' ? 'Focus Time' : 'Break Time'}
                    </span>
                </div>
            </div>

            {/* Duration Slider (Only visible when not active and in work mode) */}
            {!isActive && mode === 'work' && (
                <div className="w-full mb-6 px-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>5 min</span>
                        <span className="text-white font-bold">{duration} min</span>
                        <span>120 min</span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="120"
                        step="5"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTimer}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform active:scale-95 ${isActive ? 'bg-white hover:bg-gray-200' : 'bg-white hover:bg-gray-200'
                        }`}
                >
                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="w-12 h-12 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-gray-700 hover:text-white transition-colors"
                >
                    <RotateCcw size={20} />
                </button>
            </div>
        </div>
    );
};

export default Timer;

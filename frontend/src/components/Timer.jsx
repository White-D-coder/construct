import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import api from '../api/axios';

const Timer = ({ onSessionComplete }) => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work'); // 'work' or 'break'
    const timerRef = useRef(null);

    const WORK_TIME = 25 * 60;
    const BREAK_TIME = 5 * 60;

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
                    duration: 25, // Hardcoded for now, ideally track actual time
                    notes: 'Completed Pomodoro session'
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
            setTimeLeft(WORK_TIME);
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((mode === 'work' ? WORK_TIME : BREAK_TIME) - timeLeft) / (mode === 'work' ? WORK_TIME : BREAK_TIME) * 100;

    return (
        <div className="flex flex-col items-center">
            {/* Timer Display */}
            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                {/* Circular Progress Background */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-100"
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
                        className={`${mode === 'work' ? 'text-primary-500' : 'text-green-500'} transition-all duration-1000 ease-linear`}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Time Text */}
                <div className="absolute flex flex-col items-center">
                    <span className={`text-6xl font-bold tabular-nums ${mode === 'work' ? 'text-gray-900' : 'text-green-600'}`}>
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-gray-500 font-medium mt-2 flex items-center gap-2">
                        {mode === 'work' ? <Brain size={18} /> : <Coffee size={18} />}
                        {mode === 'work' ? 'Focus Time' : 'Break Time'}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTimer}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary-600 hover:bg-primary-700'
                        }`}
                >
                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    <RotateCcw size={20} />
                </button>
            </div>
        </div>
    );
};

export default Timer;

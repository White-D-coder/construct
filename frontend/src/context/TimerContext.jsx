import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
    const [duration, setDuration] = useState(10); // Default 10 mins (Child Mode)
    const [timeLeft, setTimeLeft] = useState(10 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work'); // 'work' or 'break'
    const [selectedGoal, setSelectedGoal] = useState('');

    // FocusQuest: Auto-pause on tab switch
    const timerRef = useRef(null);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isActive && mode === 'work') {
                setIsActive(false);
                // Optional: Play a "Wait come back!" sound or show a notification?
            }
        };

        const handleBlur = () => {
            if (isActive && mode === 'work') {
                setIsActive(false);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur); // Detection for window focus loss (tab switch or diff app)

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
        };
    }, [isActive, mode]);

    const BREAK_TIME = 3 * 60; // 3 mins (Calm)

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('timerState');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            const { endTime, isActive: savedIsActive, mode: savedMode, duration: savedDuration, selectedGoal: savedGoal } = parsed;

            if (savedIsActive && endTime) {
                const now = Date.now();
                const remaining = Math.ceil((endTime - now) / 1000);

                if (remaining > 0) {
                    setTimeLeft(remaining);
                    setIsActive(true);
                    setMode(savedMode);
                    setDuration(savedDuration);
                    setSelectedGoal(savedGoal || '');
                } else {
                    // Timer finished while away
                    setTimeLeft(0);
                    setIsActive(false);
                    setMode(savedMode); // Keep mode to show it finished? Or switch? 
                    // Let's just reset to idle or handle complete. 
                    // Ideally we should show "Session Completed" but for simplicity let's reset.
                    // Or better, set to 0 and let the interval check handle it (if we restart interval)?
                    // Actually, if we didn't start interval yet, handleComplete won't fire. 
                    // Let's set it to 0 and let the user see it's done.
                }
            } else {
                // Not active or paused
                if (parsed.timeLeft !== undefined) setTimeLeft(parsed.timeLeft);
                if (savedMode) setMode(savedMode);
                if (savedDuration) setDuration(savedDuration);
                if (savedGoal) setSelectedGoal(savedGoal);
            }
        }
    }, []);

    // Save state to localStorage whenever relevant state changes
    useEffect(() => {
        const stateToSave = {
            isActive,
            mode,
            duration,
            selectedGoal,
            timeLeft // Saved for paused state
        };

        if (isActive) {
            // If active, save the TARGET end time
            // We calculate end time based on current time + timeLeft
            stateToSave.endTime = Date.now() + (timeLeft * 1000);
        }

        localStorage.setItem('timerState', JSON.stringify(stateToSave));
    }, [isActive, mode, duration, selectedGoal, timeLeft]);

    // Timer Interval Logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    const newValue = prev - 1;
                    if (newValue <= 0) {
                        return 0;
                    }
                    return newValue;
                });
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer naturally finished
            clearInterval(timerRef.current);
            setIsActive(false);
            handleTimerComplete();
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]); // Re-run if active state changes or time hits 0

    // Effect to update timeLeft if duration changes while NOT active
    useEffect(() => {
        if (!isActive && mode === 'work') {
            // Only reset if we are not "paused" in the middle? 
            // Behavior: If user changes slider, we reset time. 
            // But if we just loaded from storage and are paused, we shouldn't overwrite.
            // We can check if timeLeft matches old duration? 
            // Simpler: If user drags slider, `setDuration` is called. 
            // We can update timeLeft there or here. 
            // Let's do it here but we need to know if it was a user action or load.
            // We will trust the component to manage this or simple rule:
            // If !isActive and time != duration*60 (and not break), maybe update?
            // Actually, `Timer.jsx` had a rule: `if (!isActive && mode === 'work') setTimeLeft(duration * 60);`
            // We'll keep that logic.
            // Issue: loading from localstorage sets duration. We don't want to reset timeLeft if we restored a paused session (e.g. 10:00 left of 25:00).
            // We can skip this effect on mount/initial load perhaps?
            // Hard to distinguish. 
            // Alternative: `setDuration` updates `timeLeft` directly.
        }
    }, [duration]);

    const changeDuration = (newDuration) => {
        setDuration(newDuration);
        if (!isActive && mode === 'work') {
            setTimeLeft(newDuration * 60);
        }
    };

    const handleTimerComplete = async () => {
        if (mode === 'work') {
            // Log session
            try {
                const res = await api.post('/sessions', {
                    duration: duration,
                    notes: 'Completed Focus session',
                    goalId: selectedGoal || null
                });

                let message = "Great job! Time for a break.";
                if (res.data.tokensAwarded > 0) {
                    message = `Great job! You earned ${res.data.tokensAwarded} tokens!`;
                    if (res.data.achievementUnlocked) {
                        message += `\nAchievement Unlocked: ${res.data.achievementUnlocked}!`;
                    }
                }

                alert(message); // Alert might be annoying on refresh, but acceptable for now.

                setMode('break');
                setTimeLeft(BREAK_TIME);
                // Auto-start break? Or wait? 
                // Previous logic: setMode, setTimeLeft. User must press play?
                // `Timer.jsx` previously: `setMode('break'); setTimeLeft(BREAK_TIME);` 
                // It didn't auto-start. So `isActive` became false naturally. 
            } catch (err) {
                console.error(err);
                alert('Session saved, but there was an error processing rewards.');
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

    return (
        <TimerContext.Provider value={{
            duration,
            changeDuration,
            timeLeft,
            isActive,
            toggleTimer,
            resetTimer,
            mode,
            selectedGoal,
            setSelectedGoal
        }}>
            {children}
        </TimerContext.Provider>
    );
};

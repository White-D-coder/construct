
import React from 'react';
import { CheckCircle, Circle, Trash2, Clock } from 'lucide-react';
import api from '../api/axios';

const GoalList = ({ goals, onGoalUpdated }) => {
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await api.delete(`/ goals / ${id} `);
                if (onGoalUpdated) onGoalUpdated();
                else window.location.reload();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleToggleStatus = async (goal) => {
        try {
            const newStatus = goal.status === 'completed' ? 'active' : 'completed';
            await api.put(`/ goals / ${goal._id} `, { status: newStatus });
            if (onGoalUpdated) onGoalUpdated();
            else window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    if (!goals || goals.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No goals yet. Create one to get started!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {goals.map((goal) => (
                <div key={goal._id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-gray-800 hover:border-gray-600 transition-colors group">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleToggleStatus(goal)}
                            className={`text - gray - 500 hover: text - white transition - colors`}
                        >
                            {goal.status === 'completed' ? <CheckCircle className="text-white" /> : <Circle />}
                        </button>
                        <div>
                            <h4 className={`font - semibold ${goal.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'} `}>
                                {goal.title}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <Clock size={14} /> {goal.targetHours}h target
                                </span>
                                {goal.deadline && (
                                    <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDelete(goal._id)}
                        className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-2"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default GoalList;

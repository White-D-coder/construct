import React from 'react';
import { CheckCircle, Circle, Clock, Trash2 } from 'lucide-react';
import api from '../api/axios';

const GoalList = ({ goals }) => {
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this goal?")) {
            try {
                await api.delete(`/goals/${id}`);
                window.location.reload(); // Simple reload for now
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (!goals || goals.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No goals yet. Start by adding one!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {goals.map((goal) => (
                <div key={goal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors group">
                    <div className="flex items-center gap-4">
                        <button className={`text-gray-400 hover:text-primary-600 transition-colors`}>
                            {goal.status === 'completed' ? <CheckCircle className="text-green-500" /> : <Circle />}
                        </button>
                        <div>
                            <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                    <Clock size={14} /> {goal.target_hours}h target
                                </span>
                                {goal.deadline && (
                                    <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDelete(goal.id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default GoalList;

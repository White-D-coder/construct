import React, { useState } from 'react';
import api from '../api/axios';
import { Plus, X } from 'lucide-react';

const GoalForm = ({ onGoalAdded, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        target_hours: '',
        deadline: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/goals', formData);
            setFormData({ title: '', target_hours: '', deadline: '' });
            if (onGoalAdded) onGoalAdded();
            if (onClose) onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-surface p-6 rounded-xl shadow-lg border border-gray-800 relative">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Create New Goal</h3>
                {onClose && (
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Goal Title</label>
                    <input
                        type="text"
                        placeholder="e.g. Master React Hooks"
                        className="w-full px-4 py-2 rounded-lg bg-background border border-gray-700 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition placeholder-gray-600"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Target Hours</label>
                        <input
                            type="number"
                            placeholder="10"
                            className="w-full px-4 py-2 rounded-lg bg-background border border-gray-700 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition placeholder-gray-600"
                            value={formData.target_hours}
                            onChange={(e) => setFormData({ ...formData, target_hours: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Deadline</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 rounded-lg bg-background border border-gray-700 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition [color-scheme:dark]"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2 mt-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                    <Plus size={20} />
                    Create Goal
                </button>
            </form>
        </div>
    );
};

export default GoalForm;

import React from 'react';
import { Target, Check, X, Clock } from 'lucide-react';

const GoalInvitationCard = ({ invitation, onAccept, onReject }) => {
    const { goal_data, sender, created_at } = invitation;
    const date = new Date(created_at).toLocaleDateString();

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Target size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-white text-lg">{goal_data.title}</h4>
                    <p className="text-gray-400 text-sm mb-1">{goal_data.description || 'No description'}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {goal_data.target_hours} hrs
                        </span>
                        <span>Invited by <span className="text-white font-medium">{sender?.username}</span></span>
                        <span>{date}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                    onClick={() => onReject(invitation.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition flex items-center justify-center gap-2"
                >
                    <X size={16} />
                    Decline
                </button>
                <button
                    onClick={() => onAccept(invitation.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                    <Check size={16} />
                    Accept Goal
                </button>
            </div>
        </div>
    );
};

export default GoalInvitationCard;

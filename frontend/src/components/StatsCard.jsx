import React from 'react';
import { Flame, Clock, BookOpen } from 'lucide-react';

const StatsCard = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                    <Flame size={24} />
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Current Streak</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.streak || 0} days</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    <Clock size={24} />
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Total Study Time</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalHours || 0} hrs</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                    <BookOpen size={24} />
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalSessions || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;

import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';

const StoreItemCard = ({ item, onRedeem, userBalance, isOwned }) => {
    const canAfford = userBalance >= item.cost;

    return (
        <div className={`bg-gray-800 rounded-xl p-6 border ${isOwned ? 'border-green-500/50' : 'border-gray-700'} relative overflow-hidden group hover:border-blue-500/50 transition-colors`}>
            {isOwned && (
                <div className="absolute top-2 right-2 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                    Owned
                </div>
            )}

            <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gray-700/50 text-blue-400 group-hover:scale-110 transition-transform">
                    {/* Placeholder for dynamic icon, using default for now */}
                    <ShoppingBag size={24} />
                </div>
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star size={16} fill="currentColor" />
                    <span>{item.cost}</span>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
            <p className="text-gray-400 text-sm mb-4 h-10 line-clamp-2">{item.description}</p>

            <button
                onClick={() => onRedeem(item)}
                disabled={isOwned || !canAfford}
                className={`w-full py-2 rounded-lg font-medium transition-all ${isOwned
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : canAfford
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
            >
                {isOwned ? 'Purchased' : canAfford ? 'Redeem' : 'Not Enough Tokens'}
            </button>
        </div>
    );
};

export default StoreItemCard;

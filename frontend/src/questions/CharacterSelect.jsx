import React from 'react';
import { Sparkles, Zap, Shield, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const characters = [
    { id: 'wizard', name: 'Silent Wizard', desc: 'Powers grow with silence.', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
    { id: 'robot', name: 'Focus Bot', desc: 'Charges battery with stillness.', icon: Zap, color: 'bg-blue-100 text-blue-600' },
    { id: 'turtle', name: 'Zen Turtle', desc: 'Slow and steady wins.', icon: Shield, color: 'bg-green-100 text-green-600' },
    { id: 'hero', name: 'Calm Hero', desc: 'Strongest when calm.', icon: Heart, color: 'bg-red-100 text-red-600' }
];

const CharacterSelect = ({ onSelect, selectedId }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {characters.map((char) => (
                <motion.div
                    key={char.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(char.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedId === char.id ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-100'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${char.color}`}>
                        <char.icon size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">{char.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{char.desc}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default CharacterSelect;

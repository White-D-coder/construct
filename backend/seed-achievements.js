require('dotenv').config();
const supabase = require('./config/supabase');

const seedAchievements = async () => {
    console.log('Seeding achievements...');

    const achievements = [
        {
            code: 'GOAL_CRUSHER',
            title: 'Goal Crusher',
            description: 'Completed your first goal!',
            icon_url: 'trophy',
            criteria: { type: 'goal_completion', count: 1 }
        }
    ];

    for (const ach of achievements) {
        const { error } = await supabase
            .from('achievements')
            .upsert(ach, { onConflict: 'code' });

        if (error) {
            console.error(`Error seeding ${ach.code}:`, error.message);
        } else {
            console.log(`Seeded: ${ach.title}`);
        }
    }

    console.log('Seeding complete.');
};

seedAchievements();

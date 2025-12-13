const supabase = require('../config/supabase');

exports.getAchievements = async (req, res) => {
    try {
        // Get all system achievements
        const { data: allAchievements, error: fetchError } = await supabase
            .from('achievements')
            .select('*');

        if (fetchError) throw fetchError;

        // Get user's earned achievements
        const { data: userAchievements, error: userError } = await supabase
            .from('user_achievements')
            .select('achievement_id, earned_at')
            .eq('user_id', req.user.id);

        if (userError) throw userError;

        // Map to show which are unlocked
        const earnedIds = new Set(userAchievements.map(ua => ua.achievement_id));

        const result = allAchievements.map(ach => ({
            ...ach,
            unlocked: earnedIds.has(ach.id),
            earnedAt: userAchievements.find(ua => ua.achievement_id === ach.id)?.earned_at || null
        }));

        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.checkAchievements = async (req, res) => {
    // This would typically be called after a session log or goal completion
    // For now, we'll just check for a simple "First Session" achievement
    try {
        const { data: sessions, error } = await supabase
            .from('study_sessions')
            .select('id')
            .eq('user_id', req.user.id);

        if (error) throw error;

        if (sessions.length >= 1) {
            // Logic to award "First Session" badge would go here
            // This requires the 'achievements' table to be populated with seed data
            res.json({ msg: 'Achievement check complete' });
        } else {
            res.json({ msg: 'No new achievements' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.awardAchievement = async (userId, code) => {
    try {
        // 1. Get achievement ID
        const { data: achievement, error: achError } = await supabase
            .from('achievements')
            .select('id')
            .eq('code', code)
            .single();

        if (achError || !achievement) return; // Achievement doesn't exist

        // 2. Check if user already has it
        const { data: existing, error: checkError } = await supabase
            .from('user_achievements')
            .select('id')
            .eq('user_id', userId)
            .eq('achievement_id', achievement.id)
            .single();

        if (existing) return; // Already earned

        // 3. Award it
        const { error: insertError } = await supabase
            .from('user_achievements')
            .insert([{ user_id: userId, achievement_id: achievement.id }]);

        if (insertError) throw insertError;

        console.log(`Awarded achievement ${code} to user ${userId}`);
    } catch (err) {
        console.error(`Error awarding achievement ${code}:`, err.message);
    }
};

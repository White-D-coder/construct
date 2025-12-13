const supabase = require('../config/supabase');

exports.getProfile = async (req, res) => {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Row not found"

        // If no profile exists, return basic user info or empty
        if (!profile) {
            return res.json({ msg: 'Profile not created yet' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateProfile = async (req, res) => {
    const { fullName, bio, avatarUrl, timezone, studyInterests } = req.body;

    try {
        const updates = {
            id: req.user.id,
            full_name: fullName,
            bio,
            avatar_url: avatarUrl,
            timezone,
            study_interests: studyInterests,
            updated_at: new Date()
        };

        const { data, error } = await supabase
            .from('profiles')
            .upsert(updates)
            .select()
            .single();

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

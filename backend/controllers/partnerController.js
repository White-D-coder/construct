const supabase = require('../config/supabase');

exports.getPotentialPartners = async (req, res) => {
    try {
        const { data: partners, error } = await supabase
            .from('users')
            .select('id, username, created_at')
            .neq('id', req.user.id)
            .limit(10);

        if (error) throw error;

        const formattedPartners = partners.map(p => ({
            _id: p.id,
            username: p.username,
            createdAt: p.created_at
        }));

        res.json(formattedPartners);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

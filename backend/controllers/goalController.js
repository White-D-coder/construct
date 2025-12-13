const supabase = require('../config/supabase');

exports.getGoals = async (req, res) => {
    try {
        const { data: goals, error } = await supabase
            .from('goals')
            .select(`
        id,
        title,
        description,
        target_hours,
        deadline,
        status,
        created_at
      `)
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Map to camelCase for frontend
        const formattedGoals = goals.map(g => ({
            _id: g.id, // Frontend expects _id from Mongoose
            title: g.title,
            description: g.description,
            targetHours: g.target_hours,
            deadline: g.deadline,
            status: g.status,
            createdAt: g.created_at
        }));

        res.json(formattedGoals);
    } catch (err) {
        console.error(err.message);
        console.error(err.message);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};

exports.createGoal = async (req, res) => {
    const { title, description, targetHours, deadline } = req.body;

    try {
        const { data: goal, error } = await supabase
            .from('goals')
            .insert([
                {
                    user_id: req.user.id,
                    title,
                    description,
                    target_hours: targetHours,
                    deadline
                }
            ])
            .select()
            .single();

        if (error) throw error;

        res.json({
            _id: goal.id,
            title: goal.title,
            description: goal.description,
            targetHours: goal.target_hours,
            deadline: goal.deadline,
            status: goal.status,
            createdAt: goal.created_at
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateGoal = async (req, res) => {
    const { title, description, targetHours, deadline, status } = req.body;

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (targetHours) updates.target_hours = targetHours;
    if (deadline) updates.deadline = deadline;
    if (status) updates.status = status;

    try {
        // Check ownership
        const { data: existingGoal, error: checkError } = await supabase
            .from('goals')
            .select('user_id')
            .eq('id', req.params.id)
            .single();

        if (checkError || !existingGoal) return res.status(404).json({ msg: 'Goal not found' });
        if (existingGoal.user_id !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const { data: goal, error } = await supabase
            .from('goals')
            .update(updates)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            _id: goal.id,
            title: goal.title,
            description: goal.description,
            targetHours: goal.target_hours,
            deadline: goal.deadline,
            status: goal.status,
            createdAt: goal.created_at
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteGoal = async (req, res) => {
    try {
        // Check ownership
        const { data: existingGoal, error: checkError } = await supabase
            .from('goals')
            .select('user_id')
            .eq('id', req.params.id)
            .single();

        if (checkError || !existingGoal) return res.status(404).json({ msg: 'Goal not found' });
        if (existingGoal.user_id !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        res.json({ msg: 'Goal removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

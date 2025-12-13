const supabase = require('../config/supabase');

exports.logSession = async (req, res) => {
    const { duration, notes, goalId } = req.body;

    try {
        const startTime = new Date(Date.now() - duration * 60000);
        const endTime = new Date();

        const { data: session, error } = await supabase
            .from('study_sessions')
            .insert([
                {
                    user_id: req.user.id,
                    duration,
                    notes,
                    goal_id: goalId || null,
                    start_time: startTime,
                    end_time: endTime
                }
            ])
            .select()
            .single();

        if (error) throw error;

        res.json({
            _id: session.id,
            duration: session.duration,
            notes: session.notes,
            goal: session.goal_id,
            startTime: session.start_time,
            endTime: session.end_time,
            createdAt: session.created_at
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getSessions = async (req, res) => {
    try {
        const { data: sessions, error } = await supabase
            .from('study_sessions')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedSessions = sessions.map(s => ({
            _id: s.id,
            duration: s.duration,
            notes: s.notes,
            goal: s.goal_id,
            startTime: s.start_time,
            endTime: s.end_time,
            createdAt: s.created_at
        }));

        res.json(formattedSessions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getStats = async (req, res) => {
    try {
        const { data: sessions, error } = await supabase
            .from('study_sessions')
            .select('start_time, duration')
            .eq('user_id', req.user.id)
            .order('start_time', { ascending: false });

        if (error) throw error;

        // Calculate Streak
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Group sessions by date
        const uniqueDates = [...new Set(sessions.map(s => {
            const d = new Date(s.start_time);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        }))];

        // Simplified streak logic (same as before)
        let currentStreak = 0;
        let expectedDate = new Date();
        expectedDate.setHours(0, 0, 0, 0);

        if (uniqueDates.length > 0) {
            const lastSessionDate = uniqueDates[0];
            const diff = (expectedDate.getTime() - lastSessionDate) / (1000 * 3600 * 24);

            if (diff <= 1) {
                currentStreak = 0;
                expectedDate = new Date(lastSessionDate);

                for (let dateMs of uniqueDates) {
                    if (dateMs === expectedDate.getTime()) {
                        currentStreak++;
                        expectedDate.setDate(expectedDate.getDate() - 1);
                    } else {
                        break;
                    }
                }
            }
        }

        // Calculate Total Hours
        const totalMinutes = sessions.reduce((acc, curr) => acc + curr.duration, 0);
        const totalHours = (totalMinutes / 60).toFixed(1);

        res.json({
            streak: currentStreak,
            totalHours,
            totalSessions: sessions.length
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

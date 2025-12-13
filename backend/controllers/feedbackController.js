const supabase = require('../config/supabase');

exports.getWeeklyFeedback = async (req, res) => {
    try {
        // Mock AI Logic
        // 1. Analyze study sessions from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: sessions, error: sessionError } = await supabase
            .from('study_sessions')
            .select('duration')
            .eq('user_id', req.user.id)
            .gte('start_time', sevenDaysAgo.toISOString());

        if (sessionError) throw sessionError;

        const totalMinutes = sessions.reduce((acc, curr) => acc + curr.duration, 0);
        const totalHours = (totalMinutes / 60).toFixed(1);

        // 2. Analyze goals
        const { data: goals, error: goalError } = await supabase
            .from('goals')
            .select('id')
            .eq('user_id', req.user.id)
            .eq('status', 'active');

        if (goalError) throw goalError;

        const goalsCount = goals.length;

        // 3. Generate Feedback
        let feedback = "";
        let sentiment = "neutral";

        if (totalHours > 10) {
            feedback = "Excellent work this week! You've put in a significant amount of study time. Keep up this momentum to smash your goals.";
            sentiment = "positive";
        } else if (totalHours > 5) {
            feedback = "Good effort this week. You're making steady progress. Try to increase your daily sessions slightly to reach the next level.";
            sentiment = "positive";
        } else if (totalHours > 0) {
            feedback = "You've made a start, but consistency is key. Try to schedule short, focused Pomodoro sessions to build your habit.";
            sentiment = "neutral";
        } else {
            feedback = "It looks like a quiet week. Don't worry, fresh start! Set a small goal for today and just get started.";
            sentiment = "encouraging";
        }

        if (goalsCount > 3) {
            feedback += " You have quite a few active goals. Make sure you're not spreading yourself too thin.";
        } else if (goalsCount === 0) {
            feedback += " Consider setting a specific goal to give your study sessions more direction.";
        }

        res.json({
            feedback,
            sentiment,
            analyzedHours: totalHours
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

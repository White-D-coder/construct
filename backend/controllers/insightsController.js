const { GoogleGenerativeAI } = require("@google/generative-ai");
const supabase = require('../config/supabase');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateWeeklyInsights = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch User's Data for the last 7 days
        // Sessions
        const { data: sessions, error: sessionError } = await supabase
            .from('study_sessions')
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (sessionError) throw sessionError;

        // Goals (Active)
        const { data: goals, error: goalError } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active');

        if (goalError) throw goalError;

        // Calculate Stats
        const totalFocusMinutes = sessions.reduce((acc, sess) => acc + sess.duration, 0);
        const totalSessions = sessions.length;
        // Group by Goal
        const goalFocus = {};
        sessions.forEach(sess => {
            if (sess.goal_id) {
                if (!goalFocus[sess.goal_id]) goalFocus[sess.goal_id] = 0;
                goalFocus[sess.goal_id] += sess.duration;
            } else {
                if (!goalFocus['Unlinked']) goalFocus['Unlinked'] = 0;
                goalFocus['Unlinked'] += sess.duration;
            }
        });

        // 2. Construct Prompt
        const prompt = `
        Act as a productivity coach. Analyze the following weekly study data for a user:
        
        Total Focus Time: ${totalFocusMinutes} minutes
        Total Sessions: ${totalSessions}
        
        Active Goals:
        ${goals.map(g => `- ${g.title} (Target: ${g.target_hours} hours)`).join('\n')}
        
        Focus Distribution (Minutes per Goal ID):
        ${JSON.stringify(goalFocus)}
        
        Based on this, provide a concise but impactful weekly insight report. 
        - Acknowledge their effort.
        - Compare their actual focus on goals vs targets.
        - Recommend where to focus more or less.
        - Suggest if they can rest or need to push harder.
        - Tone: Encouraging, strict but fair.
        - Format: Use Markdown. Keep it under 200 words.
        `;

        // 3. Call AI
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ insight: text });

    } catch (err) {
        console.error('Error generating insights:', err);
        res.status(500).json({ error: 'Failed to generate insights' });
    }
};

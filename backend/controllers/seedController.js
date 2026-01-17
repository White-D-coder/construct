const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

exports.seedTelemetry = async (req, res) => {
    try {
        console.log("Starting seed process...");
        const email = 'test@example.com';
        const password = 'password123';
        const username = 'Test User';

        // 1. Check if user exists
        let { data: user, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
            throw fetchError;
        }

        // 2. Create User if not exists
        if (!user) {
            console.log("User not found. Creating user...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([
                    { username, email, password: hashedPassword, role: 'public' }
                ])
                .select()
                .single();

            if (createError) throw createError;
            user = newUser;
            console.log("User created:", user.id);
        } else {
            console.log("User already exists:", user.id);
        }

        // 3. Create 5 Dummy Sessions
        console.log("Seeding sessions...");
        const sessions = [];
        const now = new Date();

        for (let i = 0; i < 5; i++) {
            // Random duration between 25 and 120 minutes
            const duration = Math.floor(Math.random() * (120 - 25 + 1)) + 25;

            // Random time in the last 7 days
            const daysAgo = Math.floor(Math.random() * 7);
            const startTime = new Date(now);
            startTime.setDate(startTime.getDate() - daysAgo);
            startTime.setHours(Math.floor(Math.random() * 12) + 8); // Business hours mostly

            const endTime = new Date(startTime.getTime() + duration * 60000);

            sessions.push({
                user_id: user.id,
                duration,
                notes: `Test Session ${i + 1} - ${duration} mins`,
                start_time: startTime,
                end_time: endTime,
                mood_rating: Math.floor(Math.random() * 5) + 1
            });
        }

        const { error: sessionError } = await supabase
            .from('study_sessions')
            .insert(sessions);

        if (sessionError) throw sessionError;

        res.json({
            msg: 'Database seeded successfully',
            user: { email, password },
            sessionsCreated: sessions.length
        });

    } catch (err) {
        console.error("Seed Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

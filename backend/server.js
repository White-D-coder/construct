const express = require('express');

const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['https://construct-eight-chi.vercel.app', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());

// Database Connection
// Supabase is initialized in controllers via config/supabase.js
console.log('Using Supabase for Database');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/gamification', require('./routes/gamification'));

app.get('/', (req, res) => {
    res.send('StudySphere API is running');
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;

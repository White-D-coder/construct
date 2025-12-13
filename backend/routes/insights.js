const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insightsController');
const auth = require('../middleware/auth');

console.log('Insights Router Loading...');
console.log('Auth Middleware Type:', typeof auth);
console.log('Controller Method Type:', typeof insightsController.generateWeeklyInsights);

router.get('/test', (req, res) => res.send('Insights route working'));

router.get('/weekly', auth, (req, res, next) => {
    console.log('Hit /weekly route');
    next();
}, insightsController.generateWeeklyInsights);

module.exports = router;

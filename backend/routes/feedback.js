const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getWeeklyFeedback } = require('../controllers/feedbackController');

// @route   GET api/feedback
// @desc    Get AI-generated weekly feedback
// @access  Private
router.get('/', auth, getWeeklyFeedback);

module.exports = router;

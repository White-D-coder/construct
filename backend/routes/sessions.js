const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { logSession, getSessions, getStats } = require('../controllers/sessionController');

// @route   POST api/sessions
// @desc    Log a study session
// @access  Private
router.post('/', auth, logSession);

// @route   GET api/sessions
// @desc    Get all study sessions
// @access  Private
router.get('/', auth, getSessions);

// @route   GET api/sessions/stats
// @desc    Get user study stats
// @access  Private
router.get('/stats', auth, getStats);

module.exports = router;

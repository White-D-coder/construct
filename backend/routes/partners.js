const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getPotentialPartners } = require('../controllers/partnerController');

// @route   GET api/partners
// @desc    Get potential accountability partners
// @access  Private
router.get('/', auth, getPotentialPartners);

module.exports = router;

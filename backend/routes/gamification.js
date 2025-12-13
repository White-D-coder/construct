const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAchievements, checkAchievements } = require('../controllers/gamificationController');

router.get('/', auth, getAchievements);
router.post('/check', auth, checkAchievements);

module.exports = router;

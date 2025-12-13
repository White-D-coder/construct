const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController');

// @route   GET api/goals
// @desc    Get all users goals
// @access  Private
router.get('/', auth, getGoals);

// @route   POST api/goals
// @desc    Add new goal
// @access  Private
router.post('/', auth, createGoal);

// @route   PUT api/goals/:id
// @desc    Update goal
// @access  Private
router.put('/:id', auth, updateGoal);

// @route   DELETE api/goals/:id
// @desc    Delete goal
// @access  Private
router.delete('/:id', auth, deleteGoal);

module.exports = router;

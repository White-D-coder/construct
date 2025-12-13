const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getStoreItems, getUserInventory, getUserBalance, redeemItem } = require('../controllers/storeController');

// @route   GET api/store/items
// @desc    Get all store items
// @access  Private
router.get('/items', auth, getStoreItems);

// @route   GET api/store/inventory
// @desc    Get user's purchased items
// @access  Private
router.get('/inventory', auth, getUserInventory);

// @route   GET api/store/balance
// @desc    Get user's token balance
// @access  Private
router.get('/balance', auth, getUserBalance);

// @route   POST api/store/redeem
// @desc    Redeem an item
// @access  Private
router.post('/redeem', auth, redeemItem);

module.exports = router;

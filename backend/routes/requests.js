const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendRequest, getRequests, respondToRequest } = require('../controllers/requestController');

router.post('/', auth, sendRequest);
router.get('/', auth, getRequests);
router.put('/respond', auth, respondToRequest);

module.exports = router;

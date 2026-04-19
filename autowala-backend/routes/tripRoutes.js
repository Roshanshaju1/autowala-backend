const express = require('express');
const router = express.Router();
const { bookTrip, getTripHistory, cancelTrip, completeTrip } = require('../controllers/tripController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/book', authMiddleware, bookTrip);
router.get('/history', authMiddleware, getTripHistory);
router.patch('/cancel/:trip_id', authMiddleware, cancelTrip);
router.patch('/complete/:trip_id', authMiddleware, completeTrip);

module.exports = router;

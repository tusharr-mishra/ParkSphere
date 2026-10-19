const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservations');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');

router.post('/', isLoggedIn, wrapAsync(reservationsController.createReservation));
router.post('/:id/cancel', isLoggedIn, wrapAsync(reservationsController.cancelReservation));
router.post('/:id/check-in', isLoggedIn, wrapAsync(reservationsController.checkIn));
router.post('/:id/check-out', isLoggedIn, wrapAsync(reservationsController.checkOut));

module.exports = router;

// Reservation routes: create booking, cancel, check-in, and check-out
const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservations');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');

// Create a reservation
router.post('/', isLoggedIn, wrapAsync(reservationsController.createReservation));

// Cancel an eligible confirmed or pending reservation
router.post('/:id/cancel', isLoggedIn, wrapAsync(reservationsController.cancelReservation));

// Check in at the facility gate (activates session and marks slot occupied)
router.post('/:id/check-in', isLoggedIn, wrapAsync(reservationsController.checkIn));

// Check out at the facility gate (finalizes duration, billing, and frees bay)
router.post('/:id/check-out', isLoggedIn, wrapAsync(reservationsController.checkOut));

module.exports = router;

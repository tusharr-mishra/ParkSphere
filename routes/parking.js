// Parking routes: explore catalog, facility details, reviews, and availability
const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parking');
const wrapAsync = require('../utils/wrapAsync');

// Explore catalog with filters (city, EV, price, category, sorting)
router.get('/', wrapAsync(parkingController.index));

// Detailed facility view with live bays, height clearance, and pricing
router.get('/:id', wrapAsync(parkingController.show));

// Submit a verified customer review for a facility
router.post('/:id/reviews', wrapAsync(parkingController.createReview));

// Real-time interval availability API (used for dynamic bay selection)
router.get('/:facilityId/availability', wrapAsync(parkingController.getAvailableSlots));

module.exports = router;

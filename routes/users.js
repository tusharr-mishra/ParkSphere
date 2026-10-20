// Customer routes: dashboard and booking history
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');

// Customer dashboard
router.get('/dashboard', isLoggedIn, wrapAsync(usersController.customerDashboard));

// Customer bookings history
router.get('/bookings', isLoggedIn, wrapAsync(usersController.customerBookings));

module.exports = router;

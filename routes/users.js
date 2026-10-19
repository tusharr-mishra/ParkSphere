const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');

router.get('/dashboard', isLoggedIn, wrapAsync(usersController.customerDashboard));
router.get('/bookings', isLoggedIn, wrapAsync(usersController.customerBookings));

module.exports = router;

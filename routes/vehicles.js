// Vehicle routes: list, register, and delete customer vehicles
const express = require('express');
const router = express.Router();
const vehiclesController = require('../controllers/vehicles');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');

// View registered vehicles
router.get('/', isLoggedIn, wrapAsync(vehiclesController.index));

// Register a new vehicle
router.post('/', isLoggedIn, wrapAsync(vehiclesController.create));

// Remove an existing vehicle
router.post('/:id/delete', isLoggedIn, wrapAsync(vehiclesController.delete));

module.exports = router;

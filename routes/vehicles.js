const express = require('express');
const router = express.Router();
const vehiclesController = require('../controllers/vehicles');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');

router.get('/', isLoggedIn, wrapAsync(vehiclesController.index));
router.post('/', isLoggedIn, wrapAsync(vehiclesController.create));
router.post('/:id/delete', isLoggedIn, wrapAsync(vehiclesController.delete));

module.exports = router;

const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parking');
const wrapAsync = require('../utils/wrapAsync');

router.get('/', wrapAsync(parkingController.index));
router.get('/:id', wrapAsync(parkingController.show));
router.get('/:facilityId/availability', wrapAsync(parkingController.getAvailableSlots));

module.exports = router;

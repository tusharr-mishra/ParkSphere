const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operator');
const wrapAsync = require('../utils/wrapAsync');
const { isOperator } = require('../middleware');

router.get('/dashboard', isOperator, wrapAsync(operatorController.dashboard));
router.get('/slots', isOperator, wrapAsync(operatorController.manageSlots));
router.post('/slots/:slotId/toggle', isOperator, wrapAsync(operatorController.toggleSlotStatus));

module.exports = router;

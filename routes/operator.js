// Operator routes: gate dashboard, slot management, and maintenance toggles
const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operator');
const wrapAsync = require('../utils/wrapAsync');
const { isOperator } = require('../middleware');

// Operator console dashboard
router.get('/dashboard', isOperator, wrapAsync(operatorController.dashboard));

// Physical bay inventory management grid
router.get('/slots', isOperator, wrapAsync(operatorController.manageSlots));

// Toggle bay status between AVAILABLE and MAINTENANCE
router.post('/slots/:slotId/toggle', isOperator, wrapAsync(operatorController.toggleSlotStatus));

module.exports = router;

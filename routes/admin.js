const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const wrapAsync = require('../utils/wrapAsync');
const { isAdmin } = require('../middleware');

router.get('/dashboard', isAdmin, wrapAsync(adminController.dashboard));
router.get('/audit-logs', isAdmin, wrapAsync(adminController.auditLogs));

module.exports = router;

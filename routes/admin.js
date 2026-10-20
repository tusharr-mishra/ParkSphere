// Admin routes: dashboard KPIs and audit logs
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const wrapAsync = require('../utils/wrapAsync');
const { isAdmin } = require('../middleware');

// Platform admin dashboard
router.get('/dashboard', isAdmin, wrapAsync(adminController.dashboard));

// Audit log explorer
router.get('/audit-logs', isAdmin, wrapAsync(adminController.auditLogs));

module.exports = router;

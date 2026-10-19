import { Router } from 'express';
import { auditLogsController } from './auditLogs.controller.js';

const router = Router();

router.get('/status', auditLogsController.status);

export default router;

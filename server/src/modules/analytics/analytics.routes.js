import { Router } from 'express';
import { analyticsController } from './analytics.controller.js';

const router = Router();

router.get('/status', analyticsController.status);

export default router;

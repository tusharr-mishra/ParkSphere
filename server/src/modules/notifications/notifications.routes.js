import { Router } from 'express';
import { notificationsController } from './notifications.controller.js';

const router = Router();

router.get('/status', notificationsController.status);

export default router;

import { Router } from 'express';
import { adminController } from './admin.controller.js';

const router = Router();

router.get('/status', adminController.status);

export default router;

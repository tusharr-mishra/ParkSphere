import { Router } from 'express';
import { authController } from './auth.controller.js';

const router = Router();

router.get('/status', authController.status);

export default router;

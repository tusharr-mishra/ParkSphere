import { Router } from 'express';
import { paymentsController } from './payments.controller.js';

const router = Router();

router.get('/status', paymentsController.status);

export default router;

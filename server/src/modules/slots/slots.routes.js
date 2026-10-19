import { Router } from 'express';
import { slotsController } from './slots.controller.js';

const router = Router();

router.get('/status', slotsController.status);

export default router;

import { Router } from 'express';
import { reservationsController } from './reservations.controller.js';

const router = Router();

router.get('/status', reservationsController.status);

export default router;

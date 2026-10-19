import { Router } from 'express';
import { parkingController } from './parking.controller.js';

const router = Router();

router.get('/status', parkingController.status);

export default router;

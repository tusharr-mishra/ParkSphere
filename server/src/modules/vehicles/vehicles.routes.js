import { Router } from 'express';
import { vehiclesController } from './vehicles.controller.js';

const router = Router();

router.get('/status', vehiclesController.status);

export default router;

import { Router } from 'express';
import { reviewsController } from './reviews.controller.js';

const router = Router();

router.get('/status', reviewsController.status);

export default router;

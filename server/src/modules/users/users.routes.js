import { Router } from 'express';
import { usersController } from './users.controller.js';

const router = Router();

router.get('/status', usersController.status);

export default router;

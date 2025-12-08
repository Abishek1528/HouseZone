import { Router } from 'express';
import signupRoutes from './signupRoutes.js';
import loginRoutes from './loginRoutes.js';

const router = Router();

// Mount all routes
router.use('/', signupRoutes);
router.use('/', loginRoutes);

export default router;
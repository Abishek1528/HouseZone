import { Router } from 'express';
import signupRoutes from './signupRoutes.js';
import loginRoutes from './loginRoutes.js';
import residentialRoutes from './residentialRoutes.js';

const router = Router();

// Mount all routes
router.use('/', signupRoutes);
router.use('/', loginRoutes);
router.use('/', residentialRoutes);

export default router;
import { Router } from 'express';
import signupRoutes from './signupRoutes.js';
import loginRoutes from './loginRoutes.js';
import residentialStep1Routes from './residentialStep1Routes.js';
import residentialStep2Routes from './residentialStep2Routes.js';
import residentialStep3Routes from './residentialStep3Routes.js';

const router = Router();

// Mount all routes
router.use('/', signupRoutes);
router.use('/', loginRoutes);
router.use('/', residentialStep1Routes);
router.use('/', residentialStep2Routes);
router.use('/', residentialStep3Routes);

export default router;
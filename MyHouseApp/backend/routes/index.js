import { Router } from 'express';
import signupRoutes from './signupRoutes.js';
import loginRoutes from './loginRoutes.js';
import residentialStep1Routes from './residentialStep1Routes.js';
import residentialStep2Routes from './residentialStep2Routes.js';
import residentialStep3Routes from './residentialStep3Routes.js';
import tenantRoutes from './tenantRoutes.js';
import residentialOwnerRoutes from './residentialOwnerRoutes.js';
import businessStep1Routes from './businessStep1Routes.js';
import businessStep2Routes from './businessStep2Routes.js';
import businessStep3Routes from './businessStep3Routes.js';
import businessDebugRoutes from './businessDebugRoutes.js';
import businessTenantRoutes from './businessTenantRoutes.js';

const router = Router();

// Mount all routes (without /api prefix since it's added in server.js)
router.use('/', signupRoutes);
router.use('/', loginRoutes);
router.use('/', residentialStep1Routes);
router.use('/', residentialStep2Routes);
router.use('/', residentialStep3Routes);
router.use('/', tenantRoutes);
router.use('/', residentialOwnerRoutes);
router.use('/', businessStep1Routes);
router.use('/', businessStep2Routes);
router.use('/', businessStep3Routes);
router.use('/', businessDebugRoutes);
router.use('/', businessTenantRoutes);

export default router;
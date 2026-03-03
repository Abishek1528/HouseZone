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
import vehiclesDebugRoutes from './vehiclesDebugRoutes.js';
import vehicleTenantRoutes from './vehicleTenantRoutes.js';
import vehiclesStep1Routes from './vehiclesStep1Routes.js';
import vehiclesStep2Routes from './vehiclesStep2Routes.js';
import machineryStep1Routes from './machineryStep1Routes.js';
import machineryStep2Routes from './machineryStep2Routes.js';

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
router.use('/', vehiclesStep1Routes);
router.use('/', vehiclesStep2Routes);
router.use('/', machineryStep1Routes);
router.use('/', machineryStep2Routes);
router.use('/', vehiclesDebugRoutes);
router.use('/vehicles', vehicleTenantRoutes);

export default router;
import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import * as verificationController from './verification.controller';

const router = Router();

// All verification routes require authentication
router.use(authenticate);

router.get('/status', verificationController.getStatus);
router.post('/send-otp', verificationController.sendOtp);
router.post('/verify-otp', verificationController.verifyOtp);

export default router;

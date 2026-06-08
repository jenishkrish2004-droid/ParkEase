// ============================================================
// Root Route Aggregator
// ============================================================
// All module routes are mounted here.
// New modules should be registered in this file.
// ============================================================

import { Router, Request, Response } from 'express';
import { authRouter } from './modules/auth';
import { profileRoutes } from './modules/user/user.routes';
import verificationRoutes from './modules/verification/verification.routes';
import kycRoutes from './modules/kyc/kyc.routes';
import selfieRoutes from './modules/selfie/selfie.routes';
import payoutRoutes from './modules/payout/payout.routes';

const router = Router();

// ============================================================
// Health Check
// ============================================================
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

// ============================================================
// Module Routes
// ============================================================

// Phase 2: Auth routes ✅
router.use('/auth', authRouter);

// Phase 4: User routes
router.use('/profile', profileRoutes);

// Phase 5: Verification routes
router.use('/verification', verificationRoutes);

// Phase 6: Identity and Selfie Verification
router.use('/kyc', kycRoutes);
router.use('/owner/selfie', selfieRoutes);

// Phase 7: Owner routes
// router.use('/owner', ownerRoutes);
router.use('/owner/payout', payoutRoutes);

// Phase 9: Parking spot routes
// router.use('/parking-spots', parkingSpotRoutes);

// Phase 13: Booking routes
// router.use('/bookings', bookingRoutes);

// Phase 15: Payment routes
// router.use('/payments', paymentRoutes);

// Phase 16: Review routes
// router.use('/parking-spots', reviewRoutes);

// Phase 17: Complaint routes
// router.use('/complaints', complaintRoutes);

// Phase 19: Notification routes
// router.use('/notifications', notificationRoutes);

// Phase 20: Admin routes
// router.use('/admin', adminRoutes);

// Phase 9: Upload routes
// router.use('/uploads', uploadRoutes);

export { router };

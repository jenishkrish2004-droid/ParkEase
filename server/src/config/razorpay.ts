// ============================================================
// Razorpay Configuration
// ============================================================
// Configured but not used until Phase 15 (Payment Integration)
// ============================================================

import { env } from './env';

// Razorpay SDK will be imported when needed in Phase 15.
// For now, just export the config values.

export const razorpayConfig = {
  keyId: env.RAZORPAY_KEY_ID ?? '',
  keySecret: env.RAZORPAY_KEY_SECRET ?? '',
};

export default razorpayConfig;

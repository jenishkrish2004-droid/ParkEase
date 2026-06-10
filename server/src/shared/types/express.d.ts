// ============================================================
// Express Type Augmentation
// ============================================================
// Extends Express Request to include authenticated user data.
// ============================================================

import { UserRole } from '@parkora/shared';

declare global {
  namespace Express {
    interface Request {
      /** Authenticated user data, set by auth middleware */
      user?: {
        id: string;
        email: string;
        role: UserRole;
        isOwner: boolean;
        ownerVerified: boolean;
      };
    }
  }
}

export {};

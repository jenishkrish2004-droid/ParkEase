// ============================================================
// User Roles
// ============================================================

export const UserRole = {
  USER: 'USER',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ============================================================
// User Status
// ============================================================

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DEACTIVATED: 'DEACTIVATED',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// ============================================================
// Verification Status
// ============================================================

export const VerificationStatus = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus];

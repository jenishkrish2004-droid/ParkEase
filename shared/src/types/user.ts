import type { UserRole, UserStatus, VerificationStatus } from '../constants/roles';

// ============================================================
// User
// ============================================================

export interface IUser {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: UserRole;
  isOwner: boolean;
  ownerVerified: boolean;
  status: UserStatus;
  verificationStatus: VerificationStatus;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Subset of user data safe to return in API responses */
export type IUserPublic = Omit<IUser, 'lastLoginAt'>;

// ============================================================
// KYC Document
// ============================================================

export interface IKycDocument {
  id: string;
  userId: string;
  documentType: string;
  documentNumber: string;
  documentFrontUrl: string;
  documentBackUrl: string | null;
  selfieUrl: string | null;
  status: VerificationStatus;
  rejectionReason: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Owner Profile
// ============================================================

export interface IOwnerProfile {
  id: string;
  userId: string;
  businessName: string | null;
  businessAddress: string | null;
  gstNumber: string | null;
  panNumber: string | null;
  bankAccountNumber: string | null;
  bankIfscCode: string | null;
  bankName: string | null;
  status: VerificationStatus;
  rejectionReason: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

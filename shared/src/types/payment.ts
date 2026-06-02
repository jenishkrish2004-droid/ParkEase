import type { PaymentStatus } from '../constants/bookingStatus';

// ============================================================
// Payment
// ============================================================

export interface IPayment {
  id: string;
  bookingId: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string | null;
  refundAmount: number | null;
  refundReason: string | null;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

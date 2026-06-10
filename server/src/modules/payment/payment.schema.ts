import { z } from 'zod';

export const createOrderSchema = z.object({
  bookingId: z.string()
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

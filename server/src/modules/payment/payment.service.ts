import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

export async function createOrder(bookingId: string, userId: string) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId, status: 'PENDING' }
  });

  if (!booking) {
    throw new AppError('Booking not found or already processed', 404);
  }

  // Create Razorpay Order
  const options = {
    amount: Math.round(booking.totalAmount * 100), // amount in smallest currency unit (paise)
    currency: "INR",
    receipt: `receipt_${booking.id}`
  };

  try {
    const order = await razorpay.orders.create(options);

    // Create payment record in our DB
    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        razorpayOrderId: order.id,
        amount: booking.totalAmount,
        currency: 'INR',
        status: 'PENDING'
      }
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment.id
    };
  } catch (error: any) {
    throw new AppError(`Razorpay Error: ${error.message}`, 500);
  }
}

export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  userId: string
) {
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  const body = razorpayOrderId + "|" + razorpayPaymentId;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpaySignature;

  if (!isAuthentic) {
    throw new AppError('Invalid payment signature', 400);
  }

  // Update Payment Status
  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId },
    include: { booking: true }
  });

  if (!payment) {
    throw new AppError('Payment record not found', 404);
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId,
        razorpaySignature,
        status: 'CAPTURED'
      }
    }),
    prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: 'CONFIRMED'
      }
    })
  ]);

  return { success: true };
}

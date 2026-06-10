import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';
import * as paymentService from './payment.service';
import { createOrderSchema, verifyPaymentSchema } from './payment.schema';

export async function createOrderHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { bookingId } = createOrderSchema.parse(req.body);
    const orderData = await paymentService.createOrder(bookingId, userId);
    sendSuccess(res, { order: orderData });
  } catch (error) {
    next(error);
  }
}

export async function verifyPaymentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = verifyPaymentSchema.parse(req.body);
    
    await paymentService.verifyPayment(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      userId
    );
    
    sendSuccess(res, { message: 'Payment verified successfully' });
  } catch (error) {
    next(error);
  }
}

import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../shared/utils/response';
import * as bookingService from './booking.service';
import { createBookingSchema } from './booking.schema';

export async function createBookingHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const input = createBookingSchema.parse(req.body);
    const booking = await bookingService.createBooking(userId, input);
    sendSuccess(res, { booking, message: 'Booking created successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getUserBookingsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const bookings = await bookingService.getUserBookings(userId);
    sendSuccess(res, { bookings });
  } catch (error) {
    next(error);
  }
}

export async function getUserDashboardMetricsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const metrics = await bookingService.getUserDashboardMetrics(userId);
    sendSuccess(res, { metrics });
  } catch (error) {
    next(error);
  }
}

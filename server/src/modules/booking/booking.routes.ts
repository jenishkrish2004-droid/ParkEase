import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createBookingSchema } from './booking.schema';
import {
  createBookingHandler,
  getUserBookingsHandler,
  getUserDashboardMetricsHandler
} from './booking.controller';

const router = Router();

router.use(authenticate);

router.post('/', validate(createBookingSchema), createBookingHandler);
router.get('/my-bookings', getUserBookingsHandler);
router.get('/dashboard-metrics', getUserDashboardMetricsHandler);

export default router;

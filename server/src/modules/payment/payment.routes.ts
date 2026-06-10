import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createOrderSchema, verifyPaymentSchema } from './payment.schema';
import {
  createOrderHandler,
  verifyPaymentHandler
} from './payment.controller';

const router = Router();

router.use(authenticate);

router.post('/create-order', validate(createOrderSchema), createOrderHandler);
router.post('/verify', validate(verifyPaymentSchema), verifyPaymentHandler);

export default router;

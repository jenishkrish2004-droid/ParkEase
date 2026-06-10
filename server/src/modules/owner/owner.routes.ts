import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { getOwnerMetricsHandler } from './owner.controller';

const router = Router();

router.use(authenticate);

router.get('/dashboard/metrics', getOwnerMetricsHandler);

export default router;

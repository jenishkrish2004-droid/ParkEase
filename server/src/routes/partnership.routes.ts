import { Router } from 'express';
import { createEVPartnershipApplication } from '../controllers/partnership.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/ev', createEVPartnershipApplication);

export default router;

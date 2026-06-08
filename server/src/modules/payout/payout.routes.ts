import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { savePayoutSchema } from './payout.schema';
import { getPayoutAccountHandler, savePayoutAccountHandler } from './payout.controller';

const router = Router();

router.use(authenticate);

router.get('/', getPayoutAccountHandler);
router.post('/save', validate(savePayoutSchema), savePayoutAccountHandler);
router.put('/update', validate(savePayoutSchema), savePayoutAccountHandler); // Using same handler since it's an upsert

export default router;

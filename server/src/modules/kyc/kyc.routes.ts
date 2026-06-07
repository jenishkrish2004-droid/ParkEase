import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { localUpload } from '../../middleware/upload';
import { saveDraftSchema, submitKycSchema } from './kyc.schema';
import {
  getStatusHandler,
  saveDraftHandler,
  submitKycHandler,
  uploadDocumentHandler
} from './kyc.controller';

const router = Router();

// All KYC routes require authentication
router.use(authenticate);

router.get('/status', getStatusHandler);

router.post('/draft', validate(saveDraftSchema), saveDraftHandler);

router.post('/submit', validate(submitKycSchema), submitKycHandler);

router.post('/upload', localUpload.single('file'), uploadDocumentHandler);

export default router;

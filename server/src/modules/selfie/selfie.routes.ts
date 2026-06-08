import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { getSelfieHandler, uploadSelfieHandler } from './selfie.controller';
import { localUpload } from '../../middleware/upload';

const router = Router();

router.use(authenticate);

router.get('/', getSelfieHandler);
router.post('/upload', localUpload.single('file'), uploadSelfieHandler);

export default router;

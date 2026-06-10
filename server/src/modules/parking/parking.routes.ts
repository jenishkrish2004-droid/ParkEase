import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { upload } from '../../middleware/upload';
import { createParkingSchema } from './parking.schema';
import {
  createSpotHandler,
  getOwnerSpotsHandler,
  uploadSpotImageHandler,
  searchSpotsHandler
} from './parking.controller';

const router = Router();

// Public routes
router.get('/search', searchSpotsHandler);

// Protected routes
router.use(authenticate);

router.post('/', validate(createParkingSchema), createSpotHandler);
router.get('/owner', getOwnerSpotsHandler);
router.post('/upload', upload.single('file'), uploadSpotImageHandler);

export default router;

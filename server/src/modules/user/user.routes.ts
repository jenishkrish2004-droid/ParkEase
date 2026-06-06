import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as userController from './user.controller';
import { updateProfileSchema, updatePasswordSchema } from './user.schema';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', userController.getProfile);
router.patch('/', validate(updateProfileSchema), userController.updateProfile);
router.patch('/password', validate(updatePasswordSchema), userController.updatePassword);
router.delete('/', userController.deleteAccount);

export { router as profileRoutes };

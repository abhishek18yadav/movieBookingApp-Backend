import express from 'express';

import { changePasswordController, signInController, signupController, UpdateUserRoleOrStatusController } from '../../controllers/user.js';

const router = express.Router();
router.post('/signin', signInController);
router.post('/signup', signupController);
router.post('/signin/password', changePasswordController);
router.patch('/:super_adminId', UpdateUserRoleOrStatusController);
export default router;
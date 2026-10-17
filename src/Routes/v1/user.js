import express from 'express';

import { changePasswordController, signInController, signupController, UpdateUserRoleOrStatusController } from '../../controllers/user.js';
import {userSigninSchema, userSignupSchema} from "../../Validators/user.js"
import { validate } from "../../Validators/zodValidators.js"

const router = express.Router();
router.post('/signin', validate(userSigninSchema) ,signInController);
router.post('/signup',validate(userSignupSchema), signupController);
router.post('/signin/password', changePasswordController);
router.patch('/:super_adminId', UpdateUserRoleOrStatusController);
export default router;
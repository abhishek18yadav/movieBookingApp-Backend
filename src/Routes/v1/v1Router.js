import express from 'express';

import screenRouter from '../v1/screen.js'
import userRouter from '../v1/user.js'
import theatreRouter from './theatre.js'

const router = express.Router();
router.use('/user', userRouter);
router.use('/theatres', theatreRouter);
router.use('/screen', screenRouter);
export default router;
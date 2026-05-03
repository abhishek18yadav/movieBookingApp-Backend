import express from 'express';

import screenRouter from '../v1/screen.js';
import userRouter from '../v1/user.js';
import bookingRouter from './booking.js';
import movieRouter from './movie.js';
import paymentRouter from './payment.js';
import refundRouter from './refund.js';
import showRouter from './show.js';
import theatreRouter from './theatre.js';

const router = express.Router();

router.use('/user', userRouter);
router.use('/theatres', theatreRouter);
router.use('/screen', screenRouter);
router.use('/movies', movieRouter);
router.use('/shows', showRouter);
router.use('/bookings', bookingRouter);
router.use('/payments', paymentRouter);
router.use('/refunds', refundRouter);

export default router;

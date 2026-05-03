import express from 'express';

import {
  cancelBookingController,
  createBookingController,
  getAllBookingsController,
  getBookingByIdController,
  updateBookingController
} from '../../controllers/booking.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', isAuthenticated, getAllBookingsController);
router.post('/', isAuthenticated, createBookingController);
router.get('/:id', isAuthenticated, getBookingByIdController);
router.patch('/:id', isAuthenticated, updateBookingController);
router.post('/:id/cancel', isAuthenticated, cancelBookingController);

export default router;

import express from 'express';

import {
  createPaymentController,
  getAllPaymentsController,
  getPaymentByIdController
} from '../../controllers/payment.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', isAuthenticated, getAllPaymentsController);
router.post('/', isAuthenticated, createPaymentController);
router.get('/:id', isAuthenticated, getPaymentByIdController);

export default router;

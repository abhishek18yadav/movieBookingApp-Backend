import express from 'express';

import { createOrderController, capturePaymentController } from '../../controllers/payment.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const paymentRouter = express.Router();

paymentRouter.post('/order', isAuthenticated, createOrderController);
paymentRouter.post('/capture', isAuthenticated, capturePaymentController);
export default paymentRouter;

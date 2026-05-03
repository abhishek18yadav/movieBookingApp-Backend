import express from 'express';

import { getAllRefundsController } from '../../controllers/refund.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', isAuthenticated, getAllRefundsController);

export default router;

import express from 'express';

import {
  createShowController,
  deleteShowController,
  getShowsController,
  updateShowController
} from '../../controllers/show.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getShowsController);
router.post('/', isAuthenticated, createShowController);
router.patch('/:id', isAuthenticated, updateShowController);
router.delete('/:id', isAuthenticated, deleteShowController);

export default router;

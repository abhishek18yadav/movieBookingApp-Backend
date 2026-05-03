import express from 'express';

import {
  createMovieController,
  deleteMovieController,
  getMovieByIdController,
  getMoviesController
} from '../../controllers/movie.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getMoviesController);
router.post('/', isAuthenticated, createMovieController);
router.get('/:id', getMovieByIdController);
router.delete('/:id', isAuthenticated, deleteMovieController);

export default router;

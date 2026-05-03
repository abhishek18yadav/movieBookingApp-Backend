import StatusCodes from 'http-status-codes';

import {
  createMovieServices,
  deleteMovieServices,
  fetchMoviesServices,
  getMoviByIdServices
} from '../services/movie.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

// Create Movie (super_admin only)
export const createMovieController = async (req, res) => {
  try {
    const userId = req.user;
    const data = req.body;

    const movie = await createMovieServices(data, userId);

    return res.status(StatusCodes.CREATED).json(
      successResponse(movie, 'Movie created successfully')
    );
  } catch (error) {
    console.log('createMovieController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

// Get all Movies (public)
export const getMoviesController = async (req, res) => {
  try {
    const movies = await fetchMoviesServices(req.query);

    return res.status(StatusCodes.OK).json(
      successResponse(movies, 'Movies fetched successfully')
    );
  } catch (error) {
    console.log('getMoviesController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

// Get Movie by ID (public)
export const getMovieByIdController = async (req, res) => {
  try {
    const movie = await getMoviByIdServices(req.params.id);

    return res.status(StatusCodes.OK).json(
      successResponse(movie, 'Movie fetched successfully')
    );
  } catch (error) {
    console.log('getMovieByIdController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

// Delete Movie (super_admin only)
export const deleteMovieController = async (req, res) => {
  try {
    const userId = req.user;

    const movie = await deleteMovieServices(req.params.id, userId);

    return res.status(StatusCodes.OK).json(
      successResponse(movie, 'Movie deleted successfully')
    );
  } catch (error) {
    console.log('deleteMovieController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

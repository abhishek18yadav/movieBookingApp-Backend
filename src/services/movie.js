import { StatusCodes } from 'http-status-codes';

import movieRepository from '../repositiories/movie.js'
import showRepository from '../repositiories/show.js'
import userRepository from '../repositiories/user.js'
import clientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js'
export const createMovieServices = async (data, userId) => {
  try {

    const user = await userRepository.getById(userId);

    if (!user || user.role !== "super_admin") {
      throw new clientError({
        message: "Unauthorized",
        explaination: "Only super admin can create movies",
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    const movie = await movieRepository.create(data);

    return movie;

  } catch (error) {
    console.log("error in createMovieServices", error);
    throw error;
  }
};
export const updateMovieServices = async (movieId, data, userId) => {
  try {

    const user = await userRepository.getById(userId);

    if (!user || user.role !== "super_admin") {
      throw new clientError({
        message: "Unauthorized",
        explaination: "Only super admin can update movies",
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    const updatedMovie = await movieRepository.update(movieId, data);

    if (!updatedMovie) {
      throw new clientError({
        message: "Movie not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    return updatedMovie;

  } catch (error) {
    console.log("error in updateMovieServices", error);
    throw error;
  }
};
export const deleteMovieServices = async (movieId, userId) => {
  try {

    const user = await userRepository.getById(userId);

    if (!user) {
      throw new clientError({
        message: "User not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    if (user.role !== "super_admin") {
      throw new clientError({
        message: "Unauthorized",
        explaination: "Only super admin can delete movies",
        statusCode: StatusCodes.FORBIDDEN
      });
    }
    const shows = await showRepository.find({ movie: movieId, status: "available" });

    if (shows.length > 0) {
        throw new clientError({
            message: "Cannot delete movie",
            explanation: "Active shows exist for this movie",
            statusCode: StatusCodes.BAD_REQUEST
        });
    }
    const movie = await movieRepository.delete(movieId);

    if (!movie) {
      throw new ValidationError({
        message: "Movie not found",
        errorDetails:"movie does not exist"
      });
    }

    return movie;

  } catch (error) {
    console.log("error in deleteMovieServices", error);
    throw error;
  }
};
export const getMoviByIdServices = async (movieId) => {
  try {

    const movie = await movieRepository.getById(movieId);

    if (!movie) {
      throw new clientError({
        message: "Movie not found",
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    return movie;

  } catch (error) {
    console.log("error in getMoviByIdServices", error);
    throw error;
  }
};
export const fetchMoviesServices = async (data) => {
  try {

    let query = {};
    let pagination = {};

    if (data?.name) query.name = data.name;
    if (data?.language) query.language = data.language;
    if (data?.releaseStatus) query.releaseStatus = data.releaseStatus;

    if (data?.limit) pagination.limit = Number(data.limit);

    if (data?.skip) {
      const perPage = data.limit ? Number(data.limit) : 10;
      pagination.skip = Number(data.skip) * perPage;
    }

    const movies = await movieRepository.getAll(
      query,
      {},
      pagination
    );

    return movies;

  } catch (error) {
    console.log("error in fetchMoviesServices", error);
    throw error;
  }
};
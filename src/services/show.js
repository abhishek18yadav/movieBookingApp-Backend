import StatusCodes from 'http-status-codes';

import showRepository from '../repositiories/show.js';
import theatreRepository from '../repositiories/theatre.js'
import userRepository from '../repositiories/user.js'
import clientError from '../utils/errors/clientError.js'
import validationError from '../utils/errors/validationError.js'
export const createShowService = async (data, userId) => {
    try {
        const user = await userRepository.getById(userId);
        if (!user || user.role !== 'theatre_admin' ) {
            throw new clientError({
                message: "Only theatre admin can create show",
                errorDetails: "Unauthorized",
                statusCode: StatusCodes.UNAUTHORIZED
            })
        }
        const theatre = await theatreRepository.getById(data.theatreId);
        if (!theatre) {
            throw new validationError({
                message: "Theatre not found",
                errorDetails: "Invalid theatre"
            });
        }
        if (theatre.ownerId.toString() !== userId.toString()) {
            throw new validationError({
                message: "You do not own this theatre",
                errorDetails: "Unauthorized"
            });
        }
        if (theatre.status !== "approved") {
            throw new validationError({
                message: "Theatre not approved yet",
                errorDetails: "Contact super admin"
            });
        }
        //check movie exist or not in Theatre  ,then only it can be a show
        const movieExist = theatre.movies.some((m) => m.movieId.toString() === data.movieId.toString());
        if (!movieExist) {
            throw new validationError({
                message: "Movie not available in this theatre",
                errorDetails: "Add movie first"
            });
        }
        const existingShow = await showRepository.getAll({
            screenId: data.screenId,
            timming: data.timming
        });

        if (existingShow.length > 0) {
            throw new validationError({
                message: "Show already exists at this time on this screen",
                errorDetails: "Time conflict"
            });
        }

        const newShow = await showRepository.create(data);

        return newShow;
    } catch (error) {
        console.log("error in createingShowService", error);
        throw error;
    };
};
export const getShowsService = async (query) => {
    //we are trying to filter ,all shows available accoring to are filter
  try {

    let dbQuery = {};

    if (query?.movieId) dbQuery.movieId = query.movieId;
      if (query?.theatreId) dbQuery.theatreId = query.theatreId;
      if (query?.screenId) dbQuery.screenId = query.screenId;
    // Date filter
    if (query?.date) {
      const start = new Date(query.date);
      const end = new Date(query.date);
      end.setDate(end.getDate() + 1);

      dbQuery.timming = { $gte: start, $lt: end };
    }

      const shows = await showRepository.getAll({
          filter: {
              theatreId: dbQuery.theatreId,
              screenId: dbQuery.screenId,
              movieId: dbQuery.movieId,
              timming:dbQuery.timming
            }
        });

    return shows;

    } catch (error) {
    console.log("Error in getShowsService", error);
    throw error;
    }
};
export const deleteShowService = async (showId, userId) => {
  try {

    const show = await showRepository.getById(showId);

    if (!show) {
      throw new clientError({
        message: "Show not found",
        errorDetails: "Invalid ID",
        statusCode:StatusCodes.BAD_REQUEST
      });
    }

    const theatre = await theatreRepository.getById(show.theatreId);

    // Only theatre owner allowed
    if (theatre.ownerId.toString() !== userId.toString()) {
      throw new validationError({
        message: "Unauthorized",
        errorDetails: "Not your theatre"
      });
    }

    const response = await showRepository.delete(showId);

    return response;

  } catch (error) {
    console.log("Error in deleteShowService", error);
    throw error;
  }
};
export const updateShowService = async (showId, data, userId) => {
  try {

    const show = await showRepository.getById(showId);

    if (!show) {
      throw new clientError({
        message: "Show not found",
        errorDetails: "Invalid ID",
        statusCode:StatusCodes.BAD_REQUEST
      });
    }
    const theatre = await theatreRepository.getById(show.theatreId);

    if (theatre.ownerId.toString() !== userId.toString()) {
     throw new validationError({
        message: "Unauthorized",
        errorDetails: "Not your theatre"
      });
    }

    const updatedShow = await showRepository.update(showId, data);

    return updatedShow;

  } catch (error) {
    console.log("Error in updateShowService", error);
    throw error;
  }
};
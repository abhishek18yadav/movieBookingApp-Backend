import { StatusCodes } from "http-status-codes";

import theatreRepository from "../repositiories/theatre.js";
import userRepository from "../repositiories/user.js";
import { addMovieInTheatreService } from "../services/theatre.js";
import { checkMovieInTheatreService } from "../services/theatre.js";
import {
  createTheatreService
} from "../services/theatre.js";
import { deleteTheatreService } from "../services/theatre.js";
import { getTheatreService } from "../services/theatre.js";
import { getAllTheatreService } from "../services/theatre.js";
import { updateTheatreService } from "../services/theatre.js";
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse} from "../utils/common/responseObjects.js";

export const createTheatreController = async (req, res) => {
  try {
    const theatreAdminId = req.user;
    console.log("req.user in theatre crete controller" , req.body)
    const response = await createTheatreService(
      req.body,
      theatreAdminId
    );

    return res.status(StatusCodes.CREATED).json(
      successResponse(response, "Theatre created successfully (pending approval)")
    );

  } catch (error) {
    console.log("Error in createTheatreController", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const deleteTheatreController = async (req, res) => {
  try {
    const { theatreId } = req.params;
    const theatreAdminId = req.user;

    const response = await deleteTheatreService(
      theatreId,
      theatreAdminId
    );

    return res.status(StatusCodes.OK).json(
      successResponse(response, "Theatre deleted successfully")
    );

  } catch (error) {
    console.log("Error in deleteTheatreController", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getTheatreController = async (req, res) => {
  try {
    const { theatreId } = req.params;

    const response = await getTheatreService(theatreId);

    return res.status(StatusCodes.OK).json(
      successResponse(response, "Theatre fetched successfully")
    );

  } catch (error) {
    console.log("Error in getTheatreController", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getAllTheatreController = async (req, res) => {
  try {
    const response = await getAllTheatreService(req.query);

    return res.status(StatusCodes.OK).json(
      successResponse(response, "Theatres fetched successfully")
    );

  } catch (error) {
    console.log("Error in getAllTheatreController", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const updateTheatreController = async (req, res) => {
  try {
    const { theatreId } = req.params;
    const theatreAdminId = req.user;
    const response = await updateTheatreService(
      theatreId,
      req.body,
      theatreAdminId
    );

    return res.status(StatusCodes.OK).json(
      successResponse(response, "Theatre updated successfully")
    );

  } catch (error) {
    console.log("Error in updateTheatreController", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const checkMovieInTheatreController = async (req, res) => {
  try {
    const { theatreId, movieId } = req.params;

    const exists = await checkMovieInTheatreService(
      theatreId,
      movieId
    );

    return res.status(StatusCodes.OK).json(
      successResponse({ exists }, "Movie check completed")
    );

  } catch (error) {
    console.log("Error in checkMovieInTheatreController", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
export const UpdateStatus = async (req, res) => {
  try {
    const super_adminId = req.user;//req.user has user._id
    const data = req.body;
    const user = await userRepository.getById(super_adminId);
    console.log("user is", user);
    if (user.role !== "super_admin" || !user) {
      return res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
        error: {
          explaination: "Only super_admin can change roles",
          message: "superAdmin Id is required"
        }
      })
      )}
      const theatre = await theatreRepository.getById(data.theatreId);
      if (!theatre) {
        return res.status(StatusCodes.FORBIDDEN).json( customErrorResponse({
          error:{
                message: "invalid theatre",
                explaination:"invalid Theatre"
            }}));
      }
    theatre.status = data.status;
    theatre.save();
    return res.status(StatusCodes.OK).json(successResponse(theatre,"updated status of theatre successfully"));
    } catch (error) {
        console.log("UpdateUserRoleOrStatus", error);
        throw error;
    }
}

export const addMovieToTheatreController = async (req, res) => {
  try {
    const { theatreId, movieId } = req.params;
    const theatreAdminId = req.user;

    const response = await addMovieInTheatreService(
      theatreId,
      movieId,
      req.body,
      theatreAdminId
    );

    return res.status(StatusCodes.OK).json(
      successResponse(response, "Movie added/updated in theatre successfully")
    );
  } catch (error) {
    console.log("Error in addMovieToTheatreController", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

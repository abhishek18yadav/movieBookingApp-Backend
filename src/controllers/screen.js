
import { StatusCodes } from "http-status-codes";

import { createScreenServices,deleteScreenServices,getScreensByTheatreService } from "../services/screen.js";
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObjects.js";
export const createScreenController = async (req, res) => {
    try {
        const ownerId = req.user;
      const response = await createScreenServices(req.body, ownerId);
        if (!response) {
            return res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
                message: "data of screen is not valid"
            }));
        }
        return res.status(StatusCodes.CREATED).json(successResponse(response, "screen created successfully"));

    } catch (error) {
        console.log("error in create Screen controller", error);
        if (error.status) {
            return res.status(error.status).json(customErrorResponse(error));

        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
};
export const getScreensByTheatreController = async (req, res) => {
  try {

    const { theatreId } = req.params;

    const screens = await getScreensByTheatreService(theatreId);

    return res.status(StatusCodes.OK).json(
      successResponse(screens, "Screens fetched successfully")
    );

  } catch (error) {
    console.log("Error in getScreensByTheatreController", error);

    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
export const deleteScreenController = async (req, res) => {
  try {

    const screenId = req.params.id;
    const userId = req.user;

    const response = await deleteScreenServices(screenId, userId);

    return res.status(StatusCodes.OK).json(
      successResponse(response, "Screen deleted successfully")
    );

  } catch (error) {
    console.log("Error in deleteScreenController", error);

    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
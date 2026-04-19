import StatusCodes from "http-status-codes";

import {
  createShowService,
  deleteShowService,
  getShowsService,
  updateShowService
} from "../services/showService.js";


//  Create Show
export const createShowController = async (req, res) => {
  try {

    const userId = req.user.id; // from auth middleware
    const data = req.body;

    const show = await createShowService(data, userId);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Show created successfully",
      data: show
    });

  } catch (error) {
    console.log("createShowController error", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};



// Get Shows (Public — users can explore)
export const getShowsController = async (req, res) => {
  try {

    const query = req.query;

    const shows = await getShowsService(query);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: shows
    });

  } catch (error) {
    console.log("getShowsController error", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch shows"
    });
  }
};



// Delete Show
export const deleteShowController = async (req, res) => {
  try {

    const showId = req.params.id;
    const userId = req.user.id;

    const deletedShow = await deleteShowService(showId, userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Show deleted successfully",
      data: deletedShow
    });

  } catch (error) {
    console.log("deleteShowController error", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};



//  Update Show
export const updateShowController = async (req, res) => {
  try {

    const showId = req.params.id;
    const userId = req.user.id;
    const data = req.body;

    const updatedShow = await updateShowService(
      showId,
      data,
      userId
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Show updated successfully",
      data: updatedShow
    });

  } catch (error) {
    console.log("updateShowController error", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};
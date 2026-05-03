import StatusCodes from 'http-status-codes';

import {
  cancelBookingService,
  createBookingService,
  getAllBookingsService,
  getBookingByIdService,
  updateBookingService
} from '../services/booking.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

// Create Booking
export const createBookingController = async (req, res) => {
  try {
    const booking = await createBookingService({ ...req.body, userId: req.user });

    return res.status(StatusCodes.CREATED).json(
      successResponse(booking, 'Booking created successfully')
    );
  } catch (error) {
    console.log('createBookingController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

// Get all Bookings
export const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await getAllBookingsService(req.query);

    return res.status(StatusCodes.OK).json(
      successResponse(bookings, 'Bookings fetched successfully')
    );
  } catch (error) {
    console.log('getAllBookingsController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

// Get Booking by ID
export const getBookingByIdController = async (req, res) => {
  try {
    const booking = await getBookingByIdService(req.params.id, req.user);

    return res.status(StatusCodes.OK).json(
      successResponse(booking, 'Booking fetched successfully')
    );
  } catch (error) {
    console.log('getBookingByIdController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

// Update Booking
export const updateBookingController = async (req, res) => {
  try {
    const booking = await updateBookingService(req.params.id, req.body, req.user);

    return res.status(StatusCodes.OK).json(
      successResponse(booking, 'Booking updated successfully')
    );
  } catch (error) {
    console.log('updateBookingController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

// Cancel Booking
export const cancelBookingController = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user;

    const result = await cancelBookingService(bookingId, userId);

    return res.status(StatusCodes.OK).json(
      successResponse(result, 'Booking cancelled successfully')
    );
  } catch (error) {
    console.log('cancelBookingController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

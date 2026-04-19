import { StatusCodes } from 'http-status-codes';

import bookingRepository from '../repositiories/booking.js'
import showRepository from '../repositiories/show.js'
import clientError from '../utils/errors/clientError.js'
export const createBookingService = async (data) => {
    try {
        const show = await showRepository.getById(data.showId);
        if (!show) {
            throw new clientError({
                message: "no show found",
                explaination: "now such show exist",
                statusCode:StatusCodes.BAD_REQUEST
            })
        }
        const selectedSeats = data.seats; // array of seat numbers
        const seatConfig = show.seatConfiguration;
        for (let seat of selectedSeats) {
            let foundSeat = seatConfig.find(
                s => s.row === seat.row && s.number === seat.number
          );
          if (!foundSeat) {
            throw new Error("Seat not found");
          }

          if (foundSeat.status !== "available") {
              throw new Error("Seat already booked or locked");
        
          }
          foundSeat.status = "locked";
        }
        
        data.totalCost = selectedSeats.length * show.price;
        const response = await bookingRepository.create(data);
        await show.save();
        return response;
        
    } catch (error) {
        console.log("error in createBookingServices", error);
        throw error;
    }
};
export const updateBookingService = async (bookingId, data, userId) => {
  try {

    const booking = await bookingRepository.getById(bookingId);

    if (!booking) {
      throw new clientError({
          message: "Booking not found",
          explaintion:"Booking not found",
        statusCode: 404
      });
    }

    //  Only owner can modify
    if (booking.userId.toString() !== userId.toString()) {
      throw new clientError({
          message: "Unauthorized",
          explaintion:"Unauthorized",
        statusCode: 403
      });
    }

    //  Cannot modify completed booking
    if (booking.status === "successfull") {
      throw new clientError({
          message: "Completed booking cannot be modified",
          explaintion:"Completed booking cannot be modified",        
          statusCode: 400
      });
    }

    const updatedBooking = await bookingRepository.update(
      bookingId,
      data
    );

    return updatedBooking;

  } catch (error) {
    console.log("error in updateBookingService", error);
    throw error;
  }
};
export const getBookingsService = async (userId) => {
  try {

    const bookings = await bookingRepository.getAll({
      userId: userId
    });

    return bookings;

  } catch (error) {
    console.log("error in getBookingsService", error);
    throw error;
  }
};
export const getAllBookingsService = async (data) => {
  try {

    let query = {};
    let pagination = {};

    // 🔎 Filters

    if (data?.userId) query.userId = data.userId;
    if (data?.movieId) query.movieId = data.movieId;
    if (data?.theatreId) query.theatreId = data.theatreId;
    if (data?.status) query.status = data.status;

    //  Pagination

    if (data?.limit) {
      pagination.limit = Number(data.limit);
    }

    if (data?.skip) {
      const perPage = data.limit ? Number(data.limit) : 10;
      pagination.skip = Number(data.skip) * perPage;
    }

    const bookings = await bookingRepository.getAll(
      query,
      {},
      pagination
    );

    return bookings;

  } catch (error) {
    console.log("error in getAllBookingsService", error);
    throw error;
  }
};
export const getBookingByIdService = async (bookingId, userId) => {
  try {

    const booking = await bookingRepository.getById(bookingId);

    if (!booking) {
      throw new clientError({
        message: "Booking not found",
        statusCode: 404
      });
    }

    // Owner check
    if (booking.userId.toString() !== userId.toString()) {
      throw new clientError({
        message: "Unauthorized access",
        statusCode: 403
      });
    }

    return booking;

  } catch (error) {
    console.log("error in getBookingByIdService", error);
    throw error;
  }
};
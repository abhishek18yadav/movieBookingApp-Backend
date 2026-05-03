import { StatusCodes } from 'http-status-codes';

import bookingRepository from '../repositiories/booking.js'
import refundRepository from '../repositiories/refund.js';
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
        
        data.totalCost = selectedSeats.reduce((sum, seat) => {
            const foundSeat = seatConfig.find(s => s.row === seat.row && s.number === seat.number);
            const price = show.ticketPrices[foundSeat.type];
            if (price === undefined) {
                throw new clientError({
                    message: `No price configured for seat type: ${foundSeat.type}`,
                    statusCode: StatusCodes.BAD_REQUEST
                });
            }
            return sum + price;
        }, 0);
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

export const cancelBookingService = async (bookingId, userId) => {
    try {
        // 1. Fetch booking
        const booking = await bookingRepository.getById(bookingId);
        if (!booking) {
            throw new clientError({
                message: 'Booking not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        // 2. Ownership check
        if (booking.userId.toString() !== userId.toString()) {
            throw new clientError({
                message: 'Unauthorized: you do not own this booking',
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        // 3. Status check — only successfull bookings can be cancelled
        if (booking.status !== 'successfull') {
            throw new clientError({
                message: 'Booking is not eligible for cancellation',
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        // 4. Fetch show
        const show = await showRepository.getById(booking.showId);
        if (!show) {
            throw new clientError({
                message: 'Show not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        // 5. Time check — no cancellation within 30 minutes of show
        const timeUntilShow = new Date(show.timming) - Date.now();
        if (timeUntilShow < 30 * 60 * 1000) {
            throw new clientError({
                message: 'Cannot cancel within 30 minutes of show time',
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        // 6. Release seats
        for (const seat of booking.seats) {
            const foundSeat = show.seatConfiguration.find(
                s => s.row === seat.row && s.number === seat.seatNumber
            );
            if (foundSeat) {
                foundSeat.status = 'available';
            }
        }

        // 7. Increment available seats
        show.noOfSeats += booking.noOfSeats;

        // 8. Update booking status
        booking.status = 'cancelled';

        // 9. Create refund
        const refundData = {
            bookingId: booking._id,
            userId: booking.userId,
            amount: booking.totalCost,
            status: 'pending'
        };

        // 10. Save all
        await show.save();
        await booking.save();
        const refund = await refundRepository.create(refundData);

        // 11. Return result
        return { booking, refund };

    } catch (error) {
        console.log('error in cancelBookingService', error);
        throw error;
    }
};

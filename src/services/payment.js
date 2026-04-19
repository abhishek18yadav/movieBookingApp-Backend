import StatusCodes from 'http-status-codes';

import bookingRepository from '../repositiories/booking.js'
import paymentRepository from '../repositiories/payment.js'
import showRepository from '../repositiories/show.js';
import clientError from '../utils/errors/clientError.js'
export const createPaymentServices = async (data) => {
    try {
        //first booking then payment(for that boking), if no booking then no payment
        //if payment is already done
        const booking = await bookingRepository.getById(data.bookingId);
        if (!booking) {
            throw new clientError({
                message: "booking not found",
                explaination: "no such booking available",
                statusCode: StatusCodes.NOT_FOUND
            });
        };
        if (booking.status === 'successfull') {
            throw new clientError({
                message: "booking already found",
                explaination: " such booking alredy available",
                statusCode: StatusCodes.CONFLICT
            });
        };
        // if booked and the time of payment is not immediate , then payment process is cancelled
        let bookingTime = booking.createdAt;
        let currentTime = Date.now();
        let minutes = (((currentTime - bookingTime) / 1000) / 60);
        if (minutes > 5) {
            booking.status = 'expired';
            await booking.save();
            return booking;
        }
        const payment = await paymentRepository.create({
            booking: booking._id,
            amount: data.amount,
            method: data.method
        });
        if (payment.amount !== booking.totalCost) {
            payment.status = 'failed';
        }
        if (!payment || payment.status === 'failed') {
            booking.status = 'cancelled';
            await booking.save();
            await payment.save();
            return booking;
          }
      
        payment.status = 'success';
        booking.status = 'successfull';
        const show = await showRepository.getById(data.showId);
        show.noOfSeats = show.noOfSeats - booking.noOfSeats;
        if (show.seatConfiguration) {
            const showSeatConfig = show.seatConfiguration
            const bookedSeats = booking.seats;
            const bookedSeatsMap = {};
            bookedSeats.forEach((seats) => {
                const foundSeat = show.seatConfiguration.find(
                  s => s.row === seats.row && s.number === seats.number
                );
                if (!foundSeat || foundSeat.status !== "locked") {
                  throw new Error("Seat state invalid");
                }

                foundSeat.status = "booked";
                if (!foundSeat || foundSeat.status !== "locked") {
                  throw new Error("Seat state invalid");
                }

                foundSeat.status = "booked";
                if (!bookedSeatsMap[seats.rowNumber]) {
                    bookedSeatsMap[seats.rowNumber] = new Set();
                }
                bookedSeatsMap[seats.rowNumber].add(seats.seatNumber);
            })
            showSeatConfig.rows.forEach((row) => {
                if (bookedSeatsMap[row.number]) {
                    row.seats = row.seats.map((seat) => {
                        if (bookedSeatsMap[row.number].has(seat.number)) {
                            seat.status = 2;
                        }
                        return seat;
                    })
                }
            })
        };
        await show.save();
        await booking.save();
        await payment.save();
        return booking;

    } catch (error) {
        console.log("error in createPaymentServices", error);
        throw error;
    }
};
export const getPaymentByIdServices = async (paymentId) => {
  try {

    const payment = await paymentRepository.getById(paymentId);

    if (!payment) {
      throw new clientError({
        message: "Payment not found",
        explaination: "No payment exists with this ID",
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    return payment;

  } catch (error) {
    console.log("error in getPaymentByIdServices", error);
    throw error;
  }
};
export const getAllPaymentsServices = async (data) => {
  try {

    let query = {};
    let pagination = {};

    // 🔎 Filter by booking
    if (data?.bookingId) {
      query.booking = data.bookingId;
    }

    // 🔎 Filter by payment status
    if (data?.status) {
      query.status = data.status;
    }

    // 🔎 Filter by payment method
    if (data?.method) {
      query.method = data.method;
    }

    // 📄 Pagination
    if (data?.limit) {
      pagination.limit = Number(data.limit);
    }

    if (data?.skip) {
      const perPage = data.limit ? Number(data.limit) : 10;
      pagination.skip = Number(data.skip) * perPage;
    }

    const payments = await paymentRepository.getAll(
      query,
      {},
      pagination
    );

    return payments;

  } catch (error) {
    console.log("error in getAllPaymentsServices", error);
    throw error;
  }
};
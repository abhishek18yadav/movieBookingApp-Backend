import crudRepository from './crudRepository.js'
import Booking from '../schema/booking.js'
const bookingRepository = {
    ...crudRepository(Booking),
    getBookingByUser : async (userId) => {
        const user = await Booking.find({ userId });
        return user;
    }
}
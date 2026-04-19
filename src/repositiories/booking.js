import Booking from '../schema/booking.js'
import crudRepository from './crudRepository.js'
const bookingRepository = {
    ...crudRepository(Booking),
    getBookingByUser : async (userId) => {
        const user = await Booking.find({ userId });
        return user;
    }
}
export default bookingRepository;
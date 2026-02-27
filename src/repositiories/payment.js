import crudRepository from './crudRepository.js';
import Payment from '../schema/payment.js'
const paymentRepository = {
    ...crudRepository(Payment),
    getpaymentByBookingId: async (bookingId) => {
        return Payment.find({ bookingId });
    }
}
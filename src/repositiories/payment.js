import Payment from '../schema/payment.js'
import crudRepository from './crudRepository.js';
const paymentRepository = {
    ...crudRepository(Payment),
    getpaymentByBookingId: async (bookingId) => {
        return Payment.find({ bookingId });
    }
}
export default paymentRepository;
import crudRepository from './crudRepository.js';
import payment from '../schema/payment.js';
const paymentRepository = {
    ...crudRepository(),
    updatedOrder: async function (orderId, data) {
        const updatedDoc = await payment.findOneAndUpdate(
            { orderId: orderId },
            data,
            { new: true }
        );
        return updatedDoc;
    }
}
export default paymentRepository
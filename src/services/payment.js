import paymentRepository from '../repositiories/payment.js';
import crypto from 'crypto';
import RAZOR_API_SECRET from '../config/serverConfig.js';
export const createPaymentServices = async (orderID, amount) => {
  const payment = await paymentRepository.create({
    orderID,
    amount
  })
  return payment;
}

export const updatePaymentServices = async (orderID, paymentID, status, signature) => {
  if (status === 'success') {
    const shareresponse = crypto.createHmac('sha256', RAZOR_API_SECRET).update(`${orderID}|${paymentID}`).digest('hex');
    if(shareresponse === signature) {
      const payment = await paymentRepository.updateOrder(orderId,{status:'success',paymentID});
      return payment;
    } else {
      throw new Error('Payment signature verification failed');
    }
  }
}
  
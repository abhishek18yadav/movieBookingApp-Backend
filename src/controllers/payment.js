import { StatusCodes } from 'http-status-codes';
import { internalServerError } from '../utils/common/responseObjects.js';
import razorpay from '../config/rajorConfig.js';
import { createPaymentServices , updatePaymentServices} from '../services/payment.js';
export const createOrderController = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: 'INR',
      reciept: `receipt_id_${Date.now()}_${Math.floor(Math.random() * 100)}`,
    }
    const order = await razorpay.orders.create(options);
    console.log("order", order);
    const payment = await createPaymentServices(order.id, order.amount);
    if (!payment) {
      throw new Error('order creation failed');
    }
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'order created successfully',
      data: order,
    });

  } catch { error } {
    console.log("error in createOrderController", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalServerError(error));

  }
}

export const capturePaymentController = async (req, res) => {
  try {
    await updatePaymentServices(req.body.orderId, req.body.paymentId, req.body.status, req.body.signature);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'payment captured successfully',
      data :''
    });
  } catch (error) {
    console.log("error in capturePaymentController", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalServerError(error));
  }
}
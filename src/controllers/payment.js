import StatusCodes from 'http-status-codes';

import {
  createPaymentServices,
  getAllPaymentsServices,
  getPaymentByIdServices
} from '../services/payment.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

// Create Payment
export const createPaymentController = async (req, res) => {
  try {
    const payment = await createPaymentServices(req.body);

    return res.status(StatusCodes.CREATED).json(
      successResponse(payment, 'Payment created successfully')
    );
  } catch (error) {
    console.log('createPaymentController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

// Get all Payments
export const getAllPaymentsController = async (req, res) => {
  try {
    const payments = await getAllPaymentsServices(req.query);

    return res.status(StatusCodes.OK).json(
      successResponse(payments, 'Payments fetched successfully')
    );
  } catch (error) {
    console.log('getAllPaymentsController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

// Get Payment by ID
export const getPaymentByIdController = async (req, res) => {
  try {
    const payment = await getPaymentByIdServices(req.params.id);

    return res.status(StatusCodes.OK).json(
      successResponse(payment, 'Payment fetched successfully')
    );
  } catch (error) {
    console.log('getPaymentByIdController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

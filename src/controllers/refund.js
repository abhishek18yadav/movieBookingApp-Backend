import { StatusCodes } from 'http-status-codes';

import refundRepository from '../repositiories/refund.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

// Get all Refunds
export const getAllRefundsController = async (req, res) => {
  try {
    const refunds = await refundRepository.getAll({});

    return res.status(StatusCodes.OK).json(
      successResponse(refunds, 'Refunds fetched successfully')
    );
  } catch (error) {
    console.log('getAllRefundsController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
};

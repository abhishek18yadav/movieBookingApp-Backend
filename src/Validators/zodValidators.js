import { StatusCodes } from "http-status-codes";

import { customErrorResponse } from "../utils/common/responseObjects.js";


export const validate = (schema) => {
    
    return async(req, res, next) => {
        try {
            await schema.validateAsync(req.body);
            next();
        }
        catch (error) {
            let explaination = [];
            let errorMessage = '';
            error.errors.forEach((err) => {
                explaination.push(err.path[0] + ' ' + err.message);
                errorMessage += ':' + err.path[0] + ' ' + err.message;
            });
            return res.status(StatusCodes.BAD_REQUEST).json(
                customErrorResponse({
                    message: 'Validation Error' + errorMessage,
                    explaination: explaination
                })
            );
        }
    }
}
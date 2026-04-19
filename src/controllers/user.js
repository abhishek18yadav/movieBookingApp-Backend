import { StatusCodes } from "http-status-codes";

import { createUserService,getByIdService, getUserByEmailService,UpdateUserRoleOrStatusService } from "../services/user.js";
import {customErrorResponse, internalErrorResponse, successResponse} from '../utils/common/responseObjects.js'
export const signupController = async (req, res) => {
    try {
        const response = await createUserService(req.body);
        return res.status(StatusCodes.CREATED).json(successResponse(response, "user created successfully"));
    }
    catch (error) {
        console.log("error in signupController", error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
}
export const signInController = async (req, res) => {
    try {
        const user = await getUserByEmailService(req.body);
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
                message: "user not found",
                explaination:"user not found"
                }))
            }
        console.log("user with token");
        return res.status(StatusCodes.OK).json(successResponse(user, "user SignedIn Successfully"));
        }
        catch (error) {
            console.log("error in signIn controller", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json(
                    customErrorResponse(error)
                );
            }
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                internalErrorResponse(error)
            );
        }
}
export const changePasswordController = async (req, res) => {
    try {
        const user = await getByIdService(req.userId);
         if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
                message: "user not found",
                explaination:"user not found"
                }))
            }
        const isOldPasswordCoreect = await user.isValidPassword(req.body.oldPassword);
        if (!isOldPasswordCoreect) {
             return res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
                message: "password not matched",
                explaination:"password not matched"
                }))
        }
        if (user.userStatus !== "approved") {
            return res.status(StatusCodes.FORBIDDEN).json(
                customErrorResponse({ message: "Account not approved" })
            );
        }
        user.password = req.body.newPassword;
        await user.save();
         return res.status(StatusCodes.ACCEPTED).json(successResponse(user, "user password updated successfully"));
    } catch (error) {
        console.log("error in changePassword Controller", error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(
                customErrorResponse(error)
            );
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            internalErrorResponse(error)
        );
    }
}
export const UpdateUserRoleOrStatusController = async (req, res) => {
    try {
        const super_adminId = req.params.super_adminId;
        const userId = req.body.userId;   // user to be updated
        const data = req.body;          // { role, userStatus }
        
        const response = await UpdateUserRoleOrStatusService(data, userId,super_adminId);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, "User role/status updated successfully"));

  } catch (error) {
    console.log("Error in UpdateUserRoleOrStatusController", error);

    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
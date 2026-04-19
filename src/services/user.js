import { StatusCodes } from 'http-status-codes';

import userRepository from '../repositiories/user.js';
import { createJWT } from '../utils/common/authUtils.js';
import clientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';
export const createUserService = async (data) => {
    try {
        if (!data.role || data.role === 'endUser') {
            if (data.userStatus && data.userStatus !== 'pending') {
                throw new ValidationError({
                    errorDetails: "we cant set any other status for customer",
                    message:"invalid Status"
                })
            }
        }
        if (data.role && data.role !== 'endUser') {
            data.userStatus = 'pending';
        }
        const newUser = await userRepository.create(data);
        return newUser;
    }
    catch (error) {
        console.log("error in user service layer", error);
        throw error;
    }
}
export const getUserByEmailService = async (data) => {
    try {
        console.log(data.email);
        const response = await userRepository.findUserByEmail(data.email);
        if (!response) {
            throw new clientError({
                message: 'no registered user found',
                statuscode: StatusCodes.BAD_REQUEST,
                explaination: 'invalid data email sent by client'
            });
        }
        const isPasswordCorrect = await response.isValidPassword(data.password);
                if (!isPasswordCorrect) {
                    throw new clientError({
                message: 'no registered user found',
                statuscode: StatusCodes.BAD_REQUEST,
                explaination: 'invalid data password sent by client'
            });
                }
        return {
            id:response.id,
            name: response.name,
            password: response.password,
            email: response.email,
            role: response.role,
            userStatus: response.userStatus,
            token: createJWT({ id: response._id.toString(), email: response.email })
        };
    }

    catch (error) {
        console.log("getUserByEmailService error", error);
        throw error;
    }
}
export const getByIdService = async (Id) => {
    try {
        const response =await userRepository.getById(Id);
        return response;
    }
    catch (error) {
        console.log("getByIdService error", error);
        throw error;
    }
}
export const UpdateUserRoleOrStatusService = async (data, userId,super_adminId) => {
    try {
        const user = await userRepository.getById(super_adminId);
        console.log("user is", user);
        if (user.role !== "super_admin") {
            throw new ValidationError({
                message: "Only super_admin can change roles",
                errorDetails:"superAdmin Id is required"
            });
        }
        let updateQuery = {};
        if (data.role) updateQuery.role = data.role;
        if (data.userStatus) updateQuery.userStatus = data.userStatus;
        const response = await userRepository.update(userId, updateQuery);
        return response;
    } catch (error) {
        console.log("UpdateUserRoleOrStatus", error);
        throw error;
    }
}
// export const approveEntity = async (super_adminId, userId) => {
//     // id can be theatre Id , movieId based on repository
//     const user = await userRepository.getById(userId);
//     const super_admin = await userRepository.getById(super_adminId);
//      if (!user || !super_admin) {
//                 throw new ValidationError({
//                     errorDetails: "Invalid user",
//                     message: "User not found"
//                 });
//             }
//                 if (super_admin.role !== 'super_admin') {
//                 throw new ValidationError({
//                     message: "Only super_admin  has power",
//                     errorDetails: "Unauthorized access"
//                 });
//             }
//     const updated = await repository.update(id, { status: 'approved' });
//     return updated;
// }

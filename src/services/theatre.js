import { StatusCodes } from 'http-status-codes';

import theatreRepository from '../repositiories/theatre.js'
import userRepository from '../repositiories/user.js';
import clientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js'
export const createTheatreService = async (data, theatre_adminId) => {
    try {

        // 1️ Get user
        const user = await userRepository.getById(theatre_adminId);

        if (!user) {
            throw new ValidationError({
                errorDetails: "Invalid user",
                message: "User not found"
            });
        }

        // 2️ Only theatre admin allowed
        if (user.role !== 'theatre_admin') {
            throw new ValidationError({
                message: "Only theatre admin can create theatre",
                errorDetails: "Unauthorized access"
            });
        }

        // 3️ Ensure admin account is approved
        if (user.userStatus !== 'approved') {
            throw new ValidationError({
                message: "Your account is not approved yet",
                errorDetails: "Contact super admin"
            });
        }

        // 4️ Attach ownership
        data.ownerId = theatre_adminId;

        // 5️ Force theatre status to pending
        data.status = 'pending';

        // 6️ Create theatre
        const newTheatre = await theatreRepository.create(data);

        return newTheatre;

    } catch (error) {
        console.log("Error in createTheatreService", error);
        throw error;
    }
};
export const deleteTheatreService = async (theatreId,theatre_adminId) => {
    try {
        // 1️ Get user
        const user = await userRepository.getById(theatre_adminId);

        if (!user) {
            throw new ValidationError({
                errorDetails: "Invalid user",
                message: "User not found"
            });
        }

        // 2️ Only theatre admin allowed
        if (user.role !== 'theatre_admin') {
            throw new ValidationError({
                message: "Only theatre admin can create theatre",
                errorDetails: "Unauthorized access"
            });
        }

        // 3️ Ensure admin account is approved
        if (user.userStatus !== 'approved') {
            throw new ValidationError({
                message: "Your account is not approved yet",
                errorDetails: "Contact super admin"
            });
        }



        const response = await theatreRepository.delete(theatreId);
        return response;
    } catch (error) {
        console.log("deleteTheatreService error",error);
        throw error;
    }
};
export const getTheatreService = async (theatreId) => {
    try {

        const response = await theatreRepository.getById(theatreId);
        return response;
    } catch (error) {
        console.log("error in getTheatreService", error);
        throw error;
    }

}
export const getAllTheatreService = async (data) => {
    try {
        
        let pagination = {};
        let query = {};
        if (data && data.name) {
            query.name = data.name;
        }
        if (data && data.city) {
            query.city = data.city;
        }
        if (data && data.address) {
            query.address = data.address;
        }
        if (data && data.movieId) {
            query.movieId = data.movieId;
        }
        if (data && data.ownerId) {
            query.ownerId = data.ownerId;
        }
        if (data && data.limit) {
            pagination.limit = data.limt;
        }
        if (data && data.skip) {
            let perPage = (data.limit) ? data.limit : 3;
            pagination.skip = data.skip * perPage;
        }
        const response = await theatreRepository.getAll(query, {}, pagination);
        return response;
    } catch (error) {
        console.log("error in getAllTheatreService", error);
        throw error;
    }

}
export const updateTheatreService = async (theatreId, data,theatre_adminId) => {
    try {
        // 1️ Get user ---> theatreAdmin
        const user = await userRepository.getById(theatre_adminId);

        if (!user) {
            throw new ValidationError({
                errorDetails: "Invalid user",
                message: "User not found"
            });
        }

        // 2️ Only theatre admin allowed
        if (user.role !== 'theatre_admin') {
            throw new ValidationError({
                message: "Only theatre admin can create theatre",
                errorDetails: "Unauthorized access"
            });
        }

        // 3️ Ensure admin account is approved
        if (user.userStatus !== 'approved') {
            throw new ValidationError({
                message: "Your account is not approved yet",
                errorDetails: "Contact super admin"
            });
        }
        const theatre = await theatreRepository.getById(theatreId);
        if (theatre.status !== 'approved') {
            throw new ValidationError({
                message: "Your theatre is not approved yet",
                errorDetails: "Contact super admin"
            });
        }
        const response = await theatreRepository.update(theatreId, data);
        return response;
    } catch (error) {
        console.log("error in updateTheatreService", error);
        throw error;
    }
}
export const checkMovieInTheatreService = async (theatreId, movieId) => {
    try {

        const theatre = await theatreRepository.getById(theatreId );

       if (!theatre) {
            throw new clientError({
                message: "Theatre not found",
                errorDetails: "Invalid theatre ID",
                statusCode:StatusCodes.NOT_FOUND
            });
        }

        const movieExists = theatre.movies.some(
            (movie) => movie.movieId.toString() === movieId.toString()
        );

        return movieExists;

    } catch (error) {
        console.log("Error in checkMovieInTheatreService", error);
        throw error;
    }
};
export const getMoviesInTheatreService = async (theatreId) => {
    try {

        const theatre = await theatreRepository.getById({
            id: theatreId,
            populate: { path: "movies.movieId" }
        });

        if (!theatre) {
            throw new clientError({
                message: "Theatre not found",
                errorDetails: "Invalid theatre ID",
                statusCode:StatusCodes.NOT_FOUND
            });
        }

        return theatre.movies;

    } catch (error) {
        console.log("Error in getMoviesInTheatreService", error);
        throw error;
    }
};
export const updateMovieInTheatreService = async (
    theatreId,
    movieId,
    updateData,
    userId
) => {
    try {

        const theatre = await theatreRepository.getById(theatreId);

        if (!theatre) {
            throw new clientError({
                message: "Theatre not found",
                errorDetails: "Invalid theatre ID",
                statusCode:StatusCodes.NOT_FOUND
            });
        }

        // Only owner can modify
        if (theatre.ownerId.toString() !== userId.toString()) {
            throw new clientError({
                message: "Only owner can modify",
                statusCode: StatusCodes.FORBIDDEN,
                explaination:"Only owner can modify"
            })
        }

        const movieIndex = theatre.movies.findIndex(
            (movie) => movie.movieId.toString() === movieId.toString()
        );

        if (movieIndex !== -1) {

            // Update existing movie
            theatre.movies[movieIndex] = {
                ...theatre.movies[movieIndex]._doc,
                ...updateData
            };

        } else {

            // Add new movie
            theatre.movies.push({
                movieId,
                ...updateData
            });
        }

        await theatre.save();

        return theatre;

    } catch (error) {
        console.log("Error in updateMovieInTheatreService", error);
        throw error;
    }
};
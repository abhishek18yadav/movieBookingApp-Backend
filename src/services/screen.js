import StatusCodes from 'http-status-codes';

import screenRepository from '../repositiories/screen.js'
import showRepository from '../repositiories/show.js';
import theatreRepository from '../repositiories/theatre.js'
import clientError from '../utils/errors/clientError.js'
import validationError from '../utils/errors/validationError.js'

export const createScreenServices = async (data, ownerId) => {
    try {
        const theatre = await theatreRepository.getById(data.theatreId);
        if (!theatre) {
            throw new clientError({
                message: "Theatre not found",
                statusCode: StatusCodes.NOT_FOUND,
                explaination: "Invalid Theare"
            });
        }
        console.log("here",theatre.ownerId.toString(), ownerId);
        if (theatre.ownerId.toString() !== ownerId) {
            throw new validationError({
                message: "Unauthorized",
                errorDetails: "You do not own this theatre"
            });
        }
        const newScreen = await screenRepository.create(data);
        return newScreen;
    } catch (error) {
        console.log("Error in createScreenService", error);
        throw error;
    }
};
export const getScreensByTheatreService = async (theatreId) => {
    try {
        const theatre = await theatreRepository.getById(theatreId);
        if (!theatre) {
            throw new clientError({
                message: "Theatre not found",
                statusCode: StatusCodes.NOT_FOUND,
                explaination: "Invalid Theare"
            });
        }
        const screens = await screenRepository.getScreenByTheatre(theatreId);
        return screens;
    } catch (error) {
        console.log("Error in getScreensByTheatreService", error);
        throw error;
    }
};
export const deleteScreenServices = async (screeenId, userId) => {
    try {
        const screen = await screenRepository.getById(screeenId);
        if (!screen) {
            throw new clientError({
                message: "Theatre not found",
                statusCode: StatusCodes.NOT_FOUND,
                explaination: "Invalid Theare"
            });
        }
        const theatre = await theatreRepository.getById(screen.theatreId);

        if (theatre.ownerId.toString() !== userId.toString()) {
            throw new validationError({
                message: "Unauthorized",
                errorDetails: "Not your theatre"
            });
        }

        const shows = await showRepository.getAll({
            filter: {
            screenId:screeenId
        } });

        if (shows.length > 0) {
            throw new validationError({
                message: "Cannot delete screen with existing shows",
                errorDetails: "Delete shows first"
            });
        }

        return await screenRepository.delete(screeenId);
    }catch (error) {
        console.log("Error in deleteScreenService", error);
        throw error;
    }
}

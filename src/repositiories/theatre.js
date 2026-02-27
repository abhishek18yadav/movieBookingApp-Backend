import crudRepository from "./crudRepository";
import Theatre from '../schema/theatre.js'
const theatreRepository = {
    ...crudRepository(Theatre),
    getTheatreByOwnerId: async (ownerId) => {
        return Theatre.find({ ownerId });
    }
}
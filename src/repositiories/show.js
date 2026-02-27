import crudRepository from "./crudRepository.js";
import Show from '../schema/Show.js'
const showRepository = {
    ...crudRepository(Show),
    getShowByMovie: async (movieId) => {
        return Show.find({ movieId });
    },
    getShowByTheatre: async (theatreId) => {
        return Show.find({ theatreId });
    }
}
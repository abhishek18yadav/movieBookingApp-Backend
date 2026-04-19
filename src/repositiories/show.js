import Show from '../schema/Show.js'
import crudRepository from "./crudRepository.js";
const showRepository = {
    ...crudRepository(Show),
    getShowByMovie: async (movieId) => {
        return Show.find({ movieId });
    },
    getShowByTheatre: async (theatreId) => {
        return Show.find({ theatreId });
    }
}
export default showRepository;
import Screen from '../schema/screen.js'
import crudRepository from "./crudRepository.js";

const screenRepository = {
    ...crudRepository(Screen),
    getScreenByTheatre: async (theatreId) => {
        return Screen.find({ theatreId });
    }
}
export default screenRepository;
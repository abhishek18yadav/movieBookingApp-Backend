import crudRepository from "./crudRepository.js";
import Screen from '../schema/screen.js'

const screenRepository = {
    ...crudRepository(Screen),
    getScreenByTheatre: async (theatreId) => {
        return Screen.find({ theatreId });
    }
}
import Theatre from '../schema/theatre.js'
import crudRepository from "./crudRepository.js";
const theatreRepository = {
    ...crudRepository(Theatre),
    getTheatreByOwnerId: async (ownerId) => {
        return Theatre.find({ ownerId });
    },
    getApprovedBySuperAdmin: async (superAdminId) => {
        return Theatre.find({ superAdminId, userStatus: 'approved' });
    }
}
export default theatreRepository;
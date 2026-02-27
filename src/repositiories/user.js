import crudRepository from "./crudRepository.js";
import User from '../schema/user.js'
const userRepository = {
    ...crudRepository(User),
    findUserByEmail: async (email) => {
        const user = await User.findOne({ email });
        return user;
    },
    updateUserStatus: async (id, status) => {
        const user = await User.findByIdAndUpdate(id, { userStatus: status }, { new: true });
        return user;
    }
}
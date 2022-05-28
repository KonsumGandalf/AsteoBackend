import { User } from '../schema/user.js';

export const userMongoStore = {
    async getAllUsers() {
        return await User.find().lean() || null;
    },

    async getUserById(id) {
        return await User.findOne({ _id: id }) || null;
    },
};

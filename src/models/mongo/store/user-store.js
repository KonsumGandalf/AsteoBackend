import { User } from '../schema/user.js';

export const userMongoStore = {
    async getAllUsers() {
        return await User.find().lean() || [];
    },

    async getUserById(id) {
        return await User.findOne({ _id: id }) || null;
    },

    async getUserByUsername(username) {
      return await User.findOne({ username: username }) || null;
    },

    /**
    * This method allows to create a user, but checks first if the specified parameters
    * are already used for one and returns in the end the new / found object
    * @param {*} userCreated
    */
     async createUser(userCreated) {
        const alreadyCreated = await User.findOne({
            username: userCreated.username,
        });
        if (alreadyCreated) return alreadyCreated;
        return await new User(userCreated).save();
    },

    /**
     * The deleteMany() returns a document containing the deleteCount field
     * that stores the number of deleted documents.
     * @returns {Number}
     * - n >= 0 for successful deletion
     * - -1 for missing rights
     */
    async deleteAll(user) {
      if (user.rank > 0) {
        return await User.deleteMany({});
      } return -1;
    },

    /**
     * This method deletes an entry of the database with the given rank
     * @param {*} user
     * @returns
     * - 1 for successful deletion
     * - 0 for no possible entry
     * - -1 for missing rights
     */
    async deleteUserById(deletionUserId, user) {
      try {
        if (user.rank > 0) {
          await User.deleteOne({ _id: deletionUserId });
          return 1;
        }
        return -1;
      } catch (error) {
          return 0;
      }
  },
};

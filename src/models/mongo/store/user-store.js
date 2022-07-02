import { User } from "../schema/user.js";

export const userMongoStore = {
  async getAllUsers() {
    return (await User.find().lean()) || [];
  },

  async getUserById(id) {
    return (await User.findOne({ _id: id }).lean()) || null;
  },

  async getUserByUsername(username) {
    return (await User.findOne({ username: username }).lean()) || null;
  },

  /**
   * This method allows to create a user, but checks first if the specified parameters
   * are already used for one and returns in the end the new / found object
   * @param {*} userCreated
   * - n >= 0 for successful deletion
   * - -1 for missing rights
   */
  async createUser(userCreated) {
    const alreadyCreated = await User.findOne({
      username: userCreated.username,
    }).lean();
    if (alreadyCreated) return alreadyCreated;
    if (!userCreated.image) userCreated.image = "https://bots.ondiscord.xyz/favicon/android-chrome-256x256.png";
    if (!userCreated.rank) userCreated.rank = 0;
    if (!userCreated.countPosting) userCreated.countPosting = 0;
    const user = await new User(userCreated).save();
    return await this.getUserById(user._id);
  },

  /**
   * This method allows to update a user, but checks first if user is allowed to
   * execute this operation
   * @param {*} userCreated
   * @param {*} user
   */
  async updateUser(userUpdated, user) {
    const exUser = await this.getUserById(userUpdated._id);
    if ((user.rank > exUser.rank && user.rank >= userUpdated.rank) || exUser._id.toString() === user._id.toString()) {
      await User.updateOne({ _id: userUpdated._id }, { $set: userUpdated });
      return await this.getUserById(userUpdated._id);
    }
    return -1;
  },

  /**
   * The deleteMany() returns a document containing the deleteCount field
   * that stores the number of deleted documents.
   * @returns {Number}
   * - n >= 0 for successful deletion
   * - -1 for missing rights
   */
  async deleteAll(user) {
    if (user.rank === 2) {
      return await User.deleteMany({});
    }
    return -1;
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
      console.log(deletionUserId);
      const exUser = await this.getUserById(deletionUserId);
      console.log(exUser);
      if (user.rank > exUser.rank && user.rank >= exUser.rank) {
        await User.deleteOne({ _id: deletionUserId });
        return 1;
      }
      return -1;
    } catch (error) {
      return 0;
    }
  },
};

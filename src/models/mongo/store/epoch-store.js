import { Epoch } from '../schema/epoch.js';

export const epochMongoStore = {
    async getAllEpochs() {
        return await Epoch.find().lean() || null;
    },

    async getEpochById(id) {
        return await Epoch.findOne({ _id: id }) || null;
    },

    /**
     * This method allows to create an epoch, but checks first if the specified parameters
     * are already used for one and returns in the end the new / found object
     * @param {*} epochCreated
     */
    async createEpoch(epochCreated) {
        console.log(epochCreated);
        const alreadyCreated = await Epoch.findOne({
            name: epochCreated.name,
            yearSpan: epochCreated.yearSpan,
        });
        if (alreadyCreated) return alreadyCreated;
        return await new Epoch(epochCreated).save();
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
      return await Epoch.deleteMany({});
    } return -1;
  },

  /**
   * This method deletes an entry of the database with the given rank
   * @param {String} deletionEpochId
   * @param {*} user
   * @returns
   * - 1 for successful deletion
   * - 0 for no possible entry
   * - -1 for missing rights
   */
  async deleteEpochById(deletionEpochId, user) {
    try {
      const epoch = await this.getEpochById({ _id: deletionEpochId });
      if (epoch.user === user || user.rank > 0) {
        return await Epoch.deleteOne({ _id: deletionEpochId });
      }
      return -1;
    } catch (error) {
        console.log("bad id");
        return 0;
    }
  },
};

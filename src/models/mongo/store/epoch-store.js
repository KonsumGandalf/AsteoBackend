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
        const alreadyCreated = await Epoch.findOne({
            name: epochCreated.name,
            yearSpan: epochCreated.yearSpan,
        });
        if (alreadyCreated) return alreadyCreated;
        return await new Epoch(epochCreated).save();
    },

    async deleteAll() {
      await Epoch.deleteMany({});
    },
};

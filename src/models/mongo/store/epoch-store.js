import { Epoch } from '../schema/epoch.js';

export const epochMongoStore = {
    async getAllEpochs() {
        return await Epoch.find().lean() || null;
    },

    async getEpochById(id) {
        return await Epoch.findOne({ _id: id }) || null;
    },
};

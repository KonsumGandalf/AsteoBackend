import { Epoch } from '../schema/epoch';

export const artistMongoStore = {
    async getAllEpochs() {
        return await Epoch.find().lean() || null;
    },

    async getEpochById(id) {
        return await Epoch.findOne({ _id: id }) || null;
    },
};

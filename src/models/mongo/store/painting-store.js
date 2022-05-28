import { Painting } from '../schema/painting.js';

export const paintingMongoStore = {
    async getAllPaintings() {
        return await Painting.find().lean() || null;
    },

    async getPaintingById(id) {
        return await Painting.findOne({ _id: id }) || null;
    },

    async getPaintingsByEpoch(epoch) {
        return await Painting.find({ epoch: epoch }).lean() || null;
    },

    async getPaintingsByArtist(artist) {
        return await Painting.find({ artist: artist }).lean() || null;
    },

    async getPaintingsByGallery(gallery) {
        return await Painting.find({ gallery: gallery }).lean() || null;
    },

};

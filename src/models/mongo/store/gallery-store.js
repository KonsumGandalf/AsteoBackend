import { Gallery } from '../schema/gallery.js';

export const artistMongoStore = {
    async getAllGalleries() {
        return await Gallery.find().lean() || null;
    },

    async getGalleryById(id) {
        return await Gallery.findOne({ _id: id }) || null;
    },
};

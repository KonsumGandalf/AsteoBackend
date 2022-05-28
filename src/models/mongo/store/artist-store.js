import { Artist } from '../schema/artist.js';

export const artistMongoStore = {
    async getAllArtists() {
        return await Artist.find().lean() || null;
    },

    async getArtistById(id) {
        return await Artist.findOne({ _id: id }) || null;
    },
};

import { Painting } from '../schema/painting.js';

export const paintingMongoStore = {
    async getAllPaintings() {
        return await Painting.find().lean() || [];
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

    /**
    * This method allows to create an painting, but checks first if the specified parameters
    * are already used for one and returns in the end the new / found object
    * @param {*} paintingCreated
    */
     async createPainting(paintingCreated) {
        const alreadyCreated = await Painting.findOne({
            title: paintingCreated.title,
            artist: paintingCreated.artist,
        });
        if (alreadyCreated) return alreadyCreated;
        return await new Painting(paintingCreated).save();
    },

    async deleteAll() {
      await Painting.deleteMany({});
    },
};

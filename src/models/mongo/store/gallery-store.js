import { Gallery } from '../schema/gallery.js';

export const galleryMongoStore = {
    async getAllGalleries() {
        return await Gallery.find().lean() || null;
    },

    async getGalleryById(id) {
        return await Gallery.findOne({ _id: id }) || null;
    },

    /**
    * This method allows to create an gallery, but checks first if the specified parameters
    * are already used for one and returns in the end the new / found object
    * @param {*} galleryCreated
    */
    async createGallery(galleryCreated) {
        const alreadyCreated = await Gallery.findOne({
            name: galleryCreated.name,
            lat: galleryCreated.lat,
            lng: galleryCreated.lng,
        });
        if (alreadyCreated) return alreadyCreated;
        return await new Gallery(galleryCreated).save();
    },

    async deleteAll() {
      await Gallery.deleteMany({});
    },
};

import { Gallery } from '../schema/gallery.js';

export const galleryMongoStore = {
    async getAllGalleries() {
        return await Gallery.find().lean() || [];
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

    /**
  * The deleteMany() returns a document containing the deleteCount field
  * that stores the number of deleted documents.
  * @returns {Number}
  * - n >= 0 for successful deletion
  * - -1 for missing rights
  */
  async deleteAll(user) {
    if (user.rank > 0) {
      return await Gallery.deleteMany({});
    } return -1;
  },

  /**
  * This method deletes an entry of the database with the given rank
  * @param {String} deletionGalleryId
  * @param {*} user
  * @returns
  * - 1 for successful deletion
  * - 0 for no possible entry
  * - -1 for missing rights
  */
  async deleteGalleryById(deletionGalleryId, user) {
    try {
      const gallery = await this.getGalleryById({ _id: deletionGalleryId });
      if (String(user._id) === String(gallery.user) || user.rank > 0) {
        await Gallery.deleteOne({ _id: deletionGalleryId });
        return 1;
      }
      return -1;
    } catch (error) {
      console.log("bad id");
      return 0;
    }
  },
};

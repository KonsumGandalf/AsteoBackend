import { Painting } from '../schema/painting.js';

export const paintingMongoStore = {
    async getAllPaintings() {
        return await Painting.find().lean() || [];
    },

    async getAllPaintingsByGallery(gallery) {
      return await Painting.find({ gallery: gallery }).lean() || [];
    },

    async getAllPaintingsByArtist(artist) {
      return await Painting.find({ artist: artist }).lean() || [];
    },

    async getAllPaintingsByEpoch(epoch) {
        return await Painting.find({ epoch: epoch }).lean() || [];
    },
    async getPaintingById(id) {
        return await Painting.findOne({ _id: id }).lean() || null;
    },

    /**
    * This method allows to create an painting, but checks first if the specified parameters
    * are already used for one and returns in the end the new / found object
    * @param {*} paintingCreated
    */
     async createPainting(paintingCreated) {
        const alreadyCreated = await Painting.findOne({
            title: paintingCreated.title,
            epoch: paintingCreated.epoch._id,
            artist: paintingCreated.artist._id,
            gallery: paintingCreated.gallery._id,
        }).lean();
        if (alreadyCreated) return alreadyCreated;
        const painting = await new Painting(paintingCreated).save();
        return await this.getPaintingById(painting._id);
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
     return await Painting.deleteMany({});
   } return -1;
 },

 /**
 * This method deletes an entry of the database with the given rank
 * @param {String} deletionPaintingId
 * @param {*} user
 * @returns
 * - 1 for successful deletion
 * - 0 for no possible entry
 * - -1 for missing rights
 */
 async deletePaintingById(deletionPaintingId, user) {
   try {
     const painting = await this.getPaintingById({ _id: deletionPaintingId });
     if (String(user._id) === String(painting.user) || user.rank > 0) {
       await Painting.deleteOne({ _id: deletionPaintingId });
       return 1;
     }
     return -1;
   } catch (error) {
     return 0;
   }
 },
};

import { Artist } from '../schema/artist.js';

export const artistMongoStore = {
    async getAllArtists() {
        return await Artist.find().lean() || null;
    },

    async getArtistById(id) {
        return await Artist.findOne({ _id: id }) || null;
    },

    /**
     * This method allows to create an artist, but checks first if the specified parameters
     * are already used for one and returns in the end the new / found object
     * @param {*} artistCreated
     */
    async createArtist(artistCreated) {
        const alreadyCreated = await Artist.findOne({
            firstName: artistCreated.firstName,
            secondName: artistCreated.secondName,
        });
        if (alreadyCreated) return alreadyCreated;
        return await new Artist(artistCreated).save();
    },

    /**
     * This method deletes an artist if the user has himself created the
     * artist or the user has an admin rank
     * @param {String} artistId
     * @param {*} user
     * @returns { boolean } the success of the deletion
     */
    async deleteArtistById(artistId, user) {
      try {
        const artist = await this.getArtistById(artistId);
        if (artist.user._id === user._id || user.rank > 0) {
          await Artist.deleteOne({ _id: artistId });
          return true;
        }
        return false;
      } catch (error) {
        console.log("bad id");
        return false;
      }
    },

    /**
     * The deleteMany() returns a document containing the deleteCount field
     * that stores the number of deleted documents.
     * @returns {Number} of deleted Entries
     */
    async deleteAll(user) {
      if (user.rank > 0) {
        return await Artist.deleteMany({});
      } return 0;
    },
};

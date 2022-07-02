import { Artist } from "../schema/artist.js";

export const artistMongoStore = {
  async getAllArtists() {
    return (await Artist.find().lean()) || [];
  },

  async getArtistById(id) {
    const artist = (await Artist.findOne({ _id: id }).lean()) || null;
    return artist;
  },

  /**
   * This method allows to create an artist, but checks first if the specified parameters
   * are already used for one and returns in the end the new / found object
   * @param {*} artistCreated
   */
  async createArtist(artistCreated) {
    const alreadyCreated = await Artist.findOne({
      firstName: artistCreated.firstName,
      lastName: artistCreated.lastName,
    }).lean();
    if (alreadyCreated) return alreadyCreated;
    const artist = await new Artist(artistCreated).save();
    return await this.getArtistById(artist._id);
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
      return await Artist.deleteMany({});
    }
    return -1;
  },

  /**
   * This method deletes an entry of the database with the given rank
   * @param {String} deletionArtistId
   * @param {*} user
   * @returns
   * - 1 for successful deletion
   * - 0 for no possible entry
   * - -1 for missing rights
   */
  async deleteArtistById(deletionArtistId, user) {
    try {
      const artist = await this.getArtistById({ _id: deletionArtistId });
      if (String(user._id) === String(artist.user) || user.rank > 0) {
        await Artist.deleteOne({ _id: deletionArtistId });
        return 1;
      }
      return -1;
    } catch (error) {
      return 0;
    }
  },
};

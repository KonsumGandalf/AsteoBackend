import { Post } from "../schema/post.js";

export const postMongoStore = {
  async getAllPosts() {
    return (await Post.find().lean()) || [];
  },

  async getAllPostsByUser(id) {
    return (await Post.find({ user: id }).lean()) || [];
  },

  async getAllPostsByGallery(id) {
    return (await Post.find({ gallery: id }).lean()) || [];
  },

  async getPostById(id) {
    return (await Post.findOne({ _id: id }).lean()) || null;
  },

  /**
   * This method allows to create an post, but checks first if the specified parameters
   * are already used for one and returns in the end the new / found object
   * @param {*} postCreated
   */
  async createPost(postCreated) {
    /* space for later improvement
    const alreadyCreated = await Post.findOne({
        headline: postCreated.headline,
        gallery: postCreated.gallery,
        user: postCreated.user,
    });
    if (alreadyCreated) return alreadyCreated; */
    if (!postCreated.time) postCreated.time = new Date();
    const post = await new Post(postCreated).save();
    return await this.getPostById(post._id);
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
      return await Post.deleteMany({});
    }
    return -1;
  },

  /**
   * This method deletes an entry of the database with the given rank
   * @param {String} deletionPostId
   * @param {*} user
   * @returns
   * - 1 for successful deletion
   * - 0 for no possible entry
   * - -1 for missing rights
   */
  async deletePostById(deletionPostId, user) {
    try {
      const post = await this.getPostById({ _id: deletionPostId });
      if (String(user._id) === String(post.user) || user.rank > 0) {
        await Post.deleteOne({ _id: deletionPostId });
        return 1;
      }
      return -1;
    } catch (error) {
      return 0;
    }
  },
};

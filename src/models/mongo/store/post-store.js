import { Post } from '../schema/post.js';

export const artistMongoStore = {
    async getAllPosts() {
        return await Post.find().lean() || null;
    },

    async getPostById(id) {
        return await Post.findOne({ _id: id }) || null;
    },

    async getPostsByUser(id) {
        return await Post.find({ author: id }).lean() || null;
    },

    async getPostsByPainting(id) {
        return await Post.find({ painting: id }).lean() || null;
    },
};

import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import {
 PostDBSpec, PostTemplateSpec, IdSpec, ExampleArrays,
} from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

export const postsApi = {
  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async (request, h) => {
      try {
        const gallery = await db.galleryStore.getGalleryById(request.params.galleryId);
        if (!gallery) {
          return Boom.notFound("No Gallery with this id");
        }
        const postTemplate = {
          headline: request.payload.headline,
          comment: request.payload.comment,
          time: request.payload.time,
          rating: request.payload.rating,
          gallery: gallery,
          user: request.auth.credentials,
        };
        const post = await db.postStore.createPost(postTemplate);
        h.response(post).code(201);
        if (post) return h.response(post).code(201);
        return Boom.badImplementation("Error creating post");
      } catch (err) {
        return Boom.serverUnavailable("Database Error - Error creating post");
      }
    },
    tags: ["api", "post"],
    description: "Creates a post",
    notes: "Creates a new post in the DataBase.",
    validate: { payload: PostTemplateSpec, failAction: validationError },
    response: { schema: PostDBSpec, failAction: validationError },
  },

  findAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async (request) => {
      try {
        /* two different Api Calls are bundled ByUser & ByGallery & ByAll */
        let posts;
        if (request.params.galleryId) {
          posts = await db.postStore.getAllPostsByGallery(request.params.galleryId);
        } else if (request.params.userId) {
          posts = await db.postStore.getAllPostsByUser(request.params.userId);
        } else {
          posts = await db.postStore.getAllPosts();
        }
        if (posts) return posts;
        return Boom.notFound("No posts in the Database");
      } catch (err) {
        return Boom.serverUnavailable("Database Error - No posts in the Database");
      }
    },
    tags: ["api", "post"],
    description: "Get all posts",
    notes: "Returns all posts: \n\t-[galleryId] of one gallery\n\t-[userId] of one user\n\t-[else] of the whole db",
    // validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: ExampleArrays.PostArray, failAction: validationError },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async (request) => {
      try {
        const post = await db.postStore.getPostById(request.params.id);
        if (!post) return Boom.notFound("No post with the given id");
        return post;
      } catch (err) {
        return Boom.serverUnavailable("Database Error - No post with the given id");
      }
    },
    tags: ["api", "post"],
    description: "Get the post",
    notes: "Return one specific post with its ID",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: PostDBSpec, failAction: validationError },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async (request, h) => {
      try {
        const requestingUser = request.auth.credentials;
        const success = await db.postStore.deletePostById(request.params.id, requestingUser);
        switch (success) {
          case -1:
            return Boom.badRequest("Missing rights to delete this post.");
          case 0:
            return Boom.badImplementation(`No post with id ${request.params.id} => could not be deleted`);
          default:
            return h.response(success).code(204);
        }
      } catch (err) {
        return Boom.serverUnavailable(
          `Database Error - No playlist with the id  ${request.params.id} => could not be deleted`,
        );
      }
    },
    tags: ["api", "post"],
    description: "Deletes a post",
    notes:
      "Deletes a specific post when the command is executed by an \
      Admin (rank of authorized user) or the post was created by the executing user.",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async (request, h) => {
      try {
        const requestingUser = request.auth.credentials;
        const success = await db.postStore.deleteAll(requestingUser);
        switch (success) {
          case -1:
            return Boom.badRequest("Missing right to delete all posts.");
          default:
            return h.response(success).code(204);
        }
      } catch (err) {
        return Boom.serverUnavailable("Database Error - No post in Database");
      }
    },
    tags: ["api", "post"],
    description: "Deletes all posts",
    notes: "Deletes all posts when the command is executed by an Admin (rank of authorized user).",
  },
};

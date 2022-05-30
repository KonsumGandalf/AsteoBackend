import Boom from "@hapi/boom";
import { db } from "../models/db.js";
/* import {
 PlaylistSpec, PlaylistTemplateSpec, IdSpec, ExampleArrays,
} from "../models/joi-schemas.js"; */
// import { validationError } from "./logger.js";

export const galleriesApi = {
  create: {
    auth: {
        strategy: "jwt",
    },
    handler: async (request, h) => {
      try {
        const galleryTemplate = {
          name: request.payload.name,
          lat: request.payload.lat,
          lng: request.payload.lng,
          countAllVisitors: 0,
          countCurVisitors: 0,
          avgRating: 0,
          user: request.auth.credentials,
        };
        const gallery = await db.galleryStore.createGallery(galleryTemplate);
        if (gallery) return h.response(gallery).code(201);
        return Boom.badImplementation("Error creating gallery");
      } catch (err) {
          return Boom.serverUnavailable("Database Error - Error creating gallery");
      }
    },
    tags: ["api", "gallery"],
    description: "Create an gallery",
    notes: "Returns the created gallery",
    // validate: { payload: PlaylistTemplateSpec, failAction: validationError },
    // response: { schema: PlaylistSpec, failAction: validationError },
  },

  findAll: {
    auth: {
        strategy: "jwt",
    },
    handler: async () => {
      try {
          const galleries = await db.galleryStore.getAllGalleries();
          console.log(galleries);
          if (galleries) return galleries;
          return Boom.notFound("No galleries in the Database");
      } catch (err) {
          return Boom.serverUnavailable("Database Error - No galleries in the Database");
      }
    },
    tags: ["api", "gallery"],
    description: "Get all galleries of the db",
    notes: "Returns all galleries",
    // response: { schema: ExampleArrays.PlaylistArray, failAction: validationError },
    },

  findOne: {
      auth: {
          strategy: "jwt",
      },
      handler: async (request) => {
          try {
            const gallery = await db.galleryStore.getGalleryById(request.params.id);
            if (!gallery) return Boom.notFound("No gallery with the given id");
            return gallery;
          } catch (err) {
              return Boom.serverUnavailable("Database Error - No gallery with the given id");
          }
      },
      tags: ["api", "gallery"],
      description: "Get the gallery with the given id",
      notes: "Return one specific gallery",
      // validate: { params: { id: IdSpec }, failAction: validationError },
      // response: { schema: PlaylistSpec, failAction: validationError },
  },

  deleteOne: {
    auth: {
        strategy: "jwt",
    },
    handler: async (request, h) => {
      try {
        const requestingUser = request.auth.credentials;
        const success = await db.galleryStore.deleteGalleryById(request.params.id, requestingUser);
        console.log(`success: ${success}`);
        switch (success) {
          case -1: return Boom.badRequest("Missing rights to delete this gallery.");
          case 0: return Boom.badImplementation(`No gallery with id ${request.params.id} => could not be deleted`);
          default: return h.response(success).code(204);
        }
      } catch (err) {
          return Boom.serverUnavailable(`Database Error - No playlist with the id  ${request.params.id} => could not be deleted`);
      }
    },
    tags: ["api", "gallery"],
    description: "Deletes the gallery with the given id",
    notes: "Returns the deletion success status.",
    // validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async (request, h) => {
      try {
        const requestingUser = request.auth.credentials;
        const success = await db.galleryStore.deleteAll(requestingUser);
        switch (success) {
          case -1: return Boom.badRequest("Missing right to delete all galleries.");
          default: return h.response(success).code(204);
        }
      } catch (err) {
        return Boom.serverUnavailable("Database Error - No gallery in Database");
      }
    },
  },
};

import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import {
 GalleryDBSpec, GalleryTemplateSpec, IdSpec, ExampleArrays,
} from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

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
          countAllVisitors: request.payload.countAllVisitors,
          countCurVisitors: request.payload.countCurVisitors,
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
    description: "Creates a gallery",
    notes: "Creates a new gallery in the DataBase if the name, lat and lng is not already taken.",
    validate: { payload: GalleryTemplateSpec, failAction: validationError },
    response: { schema: GalleryDBSpec, failAction: validationError },
  },

  findAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async () => {
      try {
        const galleries = await db.galleryStore.getAllGalleries();
        if (galleries) return galleries;
        return Boom.notFound("No galleries in the Database");
      } catch (err) {
        return Boom.serverUnavailable("Database Error - No galleries in the Database");
      }
    },
    tags: ["api", "gallery"],
    description: "Get all galleries",
    notes: "Returns all galleries of the db",
    response: { schema: ExampleArrays.GalleryArray, failAction: validationError },
  },

  checkIn: {
    auth: {
      strategy: "jwt",
    },
    handler: async (request) => {
      try {
        const success = await db.galleryStore.checkIn(request.params.id);
        if (!success) return Boom.notFound("No gallery with the given id");
        return success;
      } catch (err) {
        return Boom.serverUnavailable("Database Error - No gallery with the given id");
      }
    },
    tags: ["api", "gallery"],
    description: "Check in a gallery",
    notes: "Check in a gallery and increase the current & all time Visitors",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  checkOut: {
    auth: {
      strategy: "jwt",
    },
    handler: async (request) => {
      try {
        const success = await db.galleryStore.checkOut(request.params.id);
        if (success === -1) return Boom.notFound("No gallery with the given id or no current Visitor");
        return success;
      } catch (err) {
        return Boom.serverUnavailable("Database Error - No gallery with the given id");
      }
    },
    tags: ["api", "gallery"],
    description: "Check out a gallery",
    notes: "Check out a gallery and decrease the current Visitors",
    validate: { params: { id: IdSpec }, failAction: validationError },
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
    description: "Get a gallery",
    notes: "Return one specific galery with its ID",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: GalleryDBSpec, failAction: validationError },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async (request, h) => {
      try {
        const requestingUser = request.auth.credentials;
        const success = await db.galleryStore.deleteGalleryById(request.params.id, requestingUser);
        switch (success) {
          case -1:
            return Boom.badRequest("Missing rights to delete this gallery.");
          case 0:
            return Boom.badImplementation(`No gallery with id ${request.params.id} => could not be deleted`);
          default:
            return h.response(success).code(204);
        }
      } catch (err) {
        return Boom.serverUnavailable(
          `Database Error - No playlist with the id  ${request.params.id} => could not be deleted`,
        );
      }
    },
    tags: ["api", "gallery"],
    description: "Deletes a gallery",
    notes:
      "Deletes a specific gallery when the command is executed by an Admin \
      (rank of authorized user) or the gallery was created by the executing user.",
    validate: { params: { id: IdSpec }, failAction: validationError },
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
          case -1:
            return Boom.badRequest("Missing right to delete all galleries.");
          default:
            return h.response(success).code(204);
        }
      } catch (err) {
        return Boom.serverUnavailable("Database Error - No gallery in Database");
      }
    },
    tags: ["api", "gallery"],
    description: "Deletes all galleries",
    notes: "Deletes all galleries when the command is executed by an Admin (rank of authorized user).",
  },
};

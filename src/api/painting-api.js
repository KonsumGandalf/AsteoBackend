import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import {
  PaintingDBSpec, PaintingTemplateSpec, IdSpec, ExampleArrays, GalleryRef,
 EpochRef, ArtistRef
} from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

export const paintingsApi = {
  create: {
    auth: {
        strategy: "jwt",
    },
    handler: async (request, h) => {
      try {
        console.log(request.payload);
        const gallery = await db.galleryStore.getGalleryById(request.payload.gallery);
        const epoch = await db.epochStore.getEpochById(request.payload.epoch);
        const artist = await db.artistStore.getArtistById(request.payload.artist);
        if (!gallery || !epoch || !artist) {
          return Boom.notFound("Ether the Gallery, Epoch or Artist was not found.");
        }
        const paintingTemplate = {
          title: request.payload.title,
          year: request.payload.year,
          price: request.payload.price,
          gallery: gallery,
          epoch: epoch,
          artist: artist,
          image: request.payload.image,
          user: request.auth.credentials,
        };
        console.log(paintingTemplate);
        const painting = await db.paintingStore.createPainting(paintingTemplate);
        console.log(`was created`);
        if (painting) return h.response(painting).code(201);
        return Boom.badImplementation("Error creating painting");
      } catch (err) {
          return Boom.serverUnavailable("Database Error - Error creating painting");
      }
    },
    tags: ["api", "painting"],
    description: "Create a painting",
    notes: "Creates a new painting in the DataBase.",
    // eslint-disable-next-line max-len
    validate: { payload: PaintingTemplateSpec, failAction: validationError },
    response: { schema: PaintingDBSpec, failAction: validationError },
  },
  findAll: {
    auth: {
        strategy: "jwt",
    },
    handler: async (request) => {
      try {
        /** four different Api Calls are bundled ByUser & ByGallery
         * & ByArtist & ByAll
         * */
        let paintings;
        if (request.params.galleryId) {
          paintings = await db.paintingStore.getAllPaintingsByGallery(request.params.galleryId);
        } else if (request.params.artistId) {
          paintings = await db.paintingStore.getAllPaintingsByArtist(request.params.artistId);
        } else if (request.params.epochId) {
          paintings = await db.paintingStore.getAllPaintingsByEpoch(request.params.epochId);
        } else {
          paintings = await db.paintingStore.getAllPaintings();
        }
        if (paintings) return paintings;
        return Boom.notFound("No paintings in the Database");
      } catch (err) {
          return Boom.serverUnavailable("Database Error - No paintings in the Database");
      }
    },
    tags: ["api", "painting"],
    description: "Get all paintings",
    notes: "Returns all posts: \n\t-[galleryId] of one gallery\n\t-[artistId] of one artists\n\t-[epochId] of one epochs\n\t-[else] of the whole db",
    response: { schema: ExampleArrays.PaintingArray, failAction: validationError },
    },

  findOne: {
      auth: {
          strategy: "jwt",
      },
      handler: async (request) => {
          try {
            const painting = await db.paintingStore.getPaintingById(request.params.id);
            if (!painting) return Boom.notFound("No painting with the given id");
            return painting;
          } catch (err) {
              return Boom.serverUnavailable("Database Error - No painting with the given id");
          }
      },
      tags: ["api", "painting"],
      description: "Get the painting",
      notes: "Return one specific painting with its ID",
      validate: { params: { id: IdSpec }, failAction: validationError },
      response: { schema: PaintingDBSpec, failAction: validationError },
  },

  deleteOne: {
    auth: {
        strategy: "jwt",
    },
    handler: async (request, h) => {
      try {
        const requestingUser = request.auth.credentials;
        const success = await db.paintingStore.deletePaintingById(request.params.id, requestingUser);
        switch (success) {
          case -1: return Boom.badRequest("Missing rights to delete this painting.");
          case 0: return Boom.badImplementation(`No painting with id ${request.params.id} => could not be deleted`);
          default: return h.response(success).code(204);
        }
      } catch (err) {
          return Boom.serverUnavailable(`Database Error - No playlist with the id  ${request.params.id} => could not be deleted`);
      }
    },
    tags: ["api", "painting"],
    description: "Deletes a painting",
    notes: "Deletes a specific painting when the command is executed by an Admin (rank of authorized user) or the painting was created by the executing user.",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async (request, h) => {
      try {
        const requestingUser = request.auth.credentials;
        const success = await db.paintingStore.deleteAll(requestingUser);
        switch (success) {
          case -1: return Boom.badRequest("Missing right to delete all paintings.");
          default: return h.response(success).code(204);
        }
      } catch (err) {
        return Boom.serverUnavailable("Database Error - No painting in Database");
      }
    },
    tags: ["api", "painting"],
    description: "Deletes all paintings",
    notes: "Deletes all paintings when the command is executed by an Admin (rank of authorized user).",

  },
};

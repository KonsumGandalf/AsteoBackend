import Boom from "@hapi/boom";
import { db } from "../models/db.js";
/* import {
 PlaylistSpec, PlaylistTemplateSpec, IdSpec, ExampleArrays,
} from "../models/joi-schemas.js"; */
// import { validationError } from "./logger.js";

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
    description: "Create an painting",
    notes: "Returns the created painting",
    // validate: { payload: PlaylistTemplateSpec, failAction: validationError },
    // response: { schema: PlaylistSpec, failAction: validationError },
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
        console.log(`gallery ${request.params.galleryId}`);
        console.log(`artist ${request.params.artistId}`);
        console.log(`epoch ${request.params.epochId}`);
        if (request.params.galleryId) {
          paintings = await db.paintingStore.getAllPaintingsByGallery(request.params.galleryId);
        } else if (request.params.artistId) {
          paintings = await db.paintingStore.getAllPaintingsByArtist(request.params.artistId);
        } else if (request.params.epochId) {
          paintings = await db.paintingStore.getAllPaintingsByEpoch(request.params.epochId);
        } else {
          paintings = await db.paintingStore.getAllPaintings();
        }
        // console.log(paintings);
        if (paintings) return paintings;
        return Boom.notFound("No paintings in the Database");
      } catch (err) {
          return Boom.serverUnavailable("Database Error - No paintings in the Database");
      }
    },
    tags: ["api", "painting"],
    description: "Get all paintings of the db",
    notes: "Returns all paintings",
    // response: { schema: ExampleArrays.PlaylistArray, failAction: validationError },
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
      description: "Get the painting with the given id",
      notes: "Return one specific painting",
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
        const success = await db.paintingStore.deletePaintingById(request.params.id, requestingUser);
        console.log(`success: ${success}`);
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
    description: "Deletes the painting with the given id",
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
        const success = await db.paintingStore.deleteAll(requestingUser);
        switch (success) {
          case -1: return Boom.badRequest("Missing right to delete all paintings.");
          default: return h.response(success).code(204);
        }
      } catch (err) {
        return Boom.serverUnavailable("Database Error - No painting in Database");
      }
    },
  },
};

import Boom from "@hapi/boom";
import { db } from "../models/db.js";
/* import {
 PlaylistSpec, PlaylistTemplateSpec, IdSpec, ExampleArrays,
} from "../models/joi-schemas.js"; */
// import { validationError } from "./logger.js";

export const artistsApi = {
  create: {
      auth: {
          strategy: "jwt",
      },
      handler: async (request, h) => {
          try {
              const artistTemplate = {
                  firstName: request.payload.firstName,
                  lastName: request.payload.lastName,
                  description: request.payload.description,
                  countPaintings: request.payload.countPaintings,
                  user: request.auth.credentials,
              };
              const artist = await db.artistStore.createArtist(artistTemplate);
              if (artist) return h.response(artist).code(201);
              return Boom.badImplementation("Error creating artist");
          } catch (err) {
              return Boom.serverUnavailable("Database Error - Error creating artist");
          }
      },
      tags: ["api", "artist"],
      description: "Create an artist",
      notes: "Returns the created artist",
      // validate: { payload: PlaylistTemplateSpec, failAction: validationError },
      // response: { schema: PlaylistSpec, failAction: validationError },
  },

  findAll: {
    auth: {
        strategy: "jwt",
    },
    handler: async () => {
      try {
          const artists = await db.artistStore.getAllArtists();
          if (artists) return artists;
          return Boom.notFound("No artists in the Database");
      } catch (err) {
          return Boom.serverUnavailable("Database Error - No artists in the Database");
      }
    },
    tags: ["api", "artist"],
    description: "Get all artists of the db",
    notes: "Returns all artists",
    // response: { schema: ExampleArrays.PlaylistArray, failAction: validationError },
    },

  findOne: {
      auth: {
          strategy: "jwt",
      },
      handler: async (request) => {
          try {
            const artist = await db.artistStore.getArtistById(request.params.id);
            if (!artist) return Boom.notFound("No artist with the given id");
            return artist;
          } catch (err) {
              return Boom.serverUnavailable("Database Error - No artist with the given id");
          }
      },
      tags: ["api", "artist"],
      description: "Get the artist with the given id",
      notes: "Return one specific artist",
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
        const success = await db.artistStore.deleteArtistById(request.params.id, requestingUser);
        switch (success) {
          case -1: return Boom.badRequest("Missing rights to delete this artist.");
          case 0: return Boom.badImplementation(`No artist with id ${request.params.id} => could not be deleted`);
          default: return h.response(success).code(204);
        }
      } catch (err) {
          return Boom.serverUnavailable(`Database Error - No playlist with the id  ${request.params.id} => could not be deleted`);
      }
    },
    tags: ["api", "artist"],
    description: "Deletes the artist with the given id",
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
        const success = await db.artistStore.deleteAll(requestingUser);
        switch (success) {
          case -1: return Boom.badRequest("Missing right to delete all artists.");
          default: return h.response(success).code(204);
        }
      } catch (err) {
        return Boom.serverUnavailable("Database Error - No artist in Database");
      }
    },
  },
};

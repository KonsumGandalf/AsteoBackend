import Boom from "@hapi/boom";
import { db } from "../models/db.js";
/* import {
 PlaylistSpec, PlaylistTemplateSpec, IdSpec, ExampleArrays,
} from "../models/joi-schemas.js"; */
// import { validationError } from "./logger.js";

export const epochsApi = {
  create: {
      auth: {
          strategy: "jwt",
      },
      handler: async (request, h) => {
          try {
            const epochTemplate = {
              name: request.payload.name,
              description: request.payload.description,
              yearSpan: request.payload.yearSpan,
              user: request.auth.credentials,
            };
              const epoch = await db.epochStore.createEpoch(epochTemplate);
              if (epoch) return h.response(epoch).code(201);
              return Boom.badImplementation("Error creating epoch");
          } catch (err) {
              return Boom.serverUnavailable("Database Error - Error creating epoch");
          }
      },
      tags: ["api", "epoch"],
      description: "Create an epoch",
      notes: "Returns the created epoch",
      // validate: { payload: PlaylistTemplateSpec, failAction: validationError },
      // response: { schema: PlaylistSpec, failAction: validationError },
  },

  findAll: {
    auth: {
        strategy: "jwt",
    },
    handler: async () => {
      try {
          const epochs = await db.epochStore.getAllEpochs();
          if (epochs) return epochs;
          return Boom.notFound("No epochs in the Database");
      } catch (err) {
          return Boom.serverUnavailable("Database Error - No epochs in the Database");
      }
    },
    tags: ["api", "epoch"],
    description: "Get all epochs of the db",
    notes: "Returns all epochs",
    // response: { schema: ExampleArrays.PlaylistArray, failAction: validationError },
    },

  findOne: {
      auth: {
          strategy: "jwt",
      },
      handler: async (request) => {
          try {
            const epoch = await db.epochStore.getEpochById(request.params.id);
            if (!epoch) return Boom.notFound("No epoch with the given id");
            return epoch;
          } catch (err) {
              return Boom.serverUnavailable("Database Error - No epoch with the given id");
          }
      },
      tags: ["api", "epoch"],
      description: "Get the epoch with the given id",
      notes: "Return one specific epoch",
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
        const success = await db.epochStore.deleteEpochById(request.params.id, requestingUser);
        switch (success) {
          case -1: return Boom.badRequest("Missing rights to delete this epoch.");
          case 0: return Boom.badImplementation(`No epoch with id ${request.params.id} => could not be deleted`);
          default: return h.response(success).code(204);
        }
      } catch (err) {
          return Boom.serverUnavailable(`Database Error - No playlist with the id  ${request.params.id} => could not be deleted`);
      }
    },
    tags: ["api", "epoch"],
    description: "Deletes the epoch with the given id",
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
        const success = await db.epochStore.deleteAll(requestingUser);
        switch (success) {
          case -1: return Boom.badRequest("Missing right to delete all epochs.");
          default: return h.response(success).code(204);
        }
      } catch (err) {
        return Boom.serverUnavailable("Database Error - No epoch in Database");
      }
    },
  },
};

import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import {
 EpochDBSpec, EpochTemplateSpec, IdSpec, ExampleArrays,
} from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

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
          image: request.payload.image,
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
    description: "Creates an epoch",
    notes: "Creates a new epoch in the DataBase if the name and yearSpan is not already taken.",
    validate: { payload: EpochTemplateSpec, failAction: validationError },
    response: { schema: EpochDBSpec, failAction: validationError },
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
    description: "Get all epoch",
    notes: "Returns all artists of the db",
    response: { schema: ExampleArrays.EpochArray, failAction: validationError },
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
    description: "Get one epoch",
    notes: "Returns one specific epoch with its ID",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: EpochDBSpec, failAction: validationError },
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
          case -1:
            return Boom.badRequest("Missing rights to delete this epoch.");
          case 0:
            return Boom.badImplementation(`No epoch with id ${request.params.id} => could not be deleted`);
          default:
            return h.response(success).code(204);
        }
      } catch (err) {
        return Boom.serverUnavailable(
          `Database Error - No playlist with the id  ${request.params.id} => could not be deleted`,
        );
      }
    },
    tags: ["api", "epoch"],
    description: "Deletes an epoch",
    notes:
      "Deletes a specific epoch when the command is executed by an Admin \
      (rank of authorized user) or the artist was created by the executing user.",
    validate: { params: { id: IdSpec }, failAction: validationError },
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
          case -1:
            return Boom.badRequest("Missing right to delete all epochs.");
          default:
            return h.response(success).code(204);
        }
      } catch (err) {
        return Boom.serverUnavailable("Database Error - No epoch in Database");
      }
    },
    tags: ["api", "epoch"],
    description: "Deletes all epochs",
    notes: "Deletes all epochs when the command is executed by an Admin (rank of authorized user).",
  },
};

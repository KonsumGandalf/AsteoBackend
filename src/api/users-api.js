import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import {
 UserLoginSpec, UserRegisterSpec, ExampleArrays, IdSpec, AuthSpec, UserDBSpec,
} from "../models/joi-schemas.js";
import { validationError } from "./logger.js";
import { createToken } from "./jwt-utils.js";

export const usersApi = {
  create: {
    auth: false,
    handler: async (request, h) => {
      try {
        const user = await db.userStore.createUser(request.payload);
        if (user) {
          const res = h.response(user).code(201);
          return res;
        }
        return Boom.badImplementation("Error creating user");
      } catch (err) {
        return Boom.serverUnavailable("Database Error - error creating user");
      }
    },
    tags: ["api", "user"],
    description: "Creates a new user",
    notes: "Creates a new user in the DataBase if the username and password is not already taken.",
    validate: { payload: UserRegisterSpec, failAction: validationError },
    response: { schema: UserDBSpec, failAction: validationError },
  },

  findAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async () => {
      try {
        const users = await db.userStore.getAllUsers();
        if (users) return users;
        return Boom.notFound("No users in the Database");
      } catch (err) {
          return Boom.serverUnavailable("Database Error - No users in the Database");
      }
    },
    tags: ["api", "user"],
    description: "Get all users",
    notes: "Returns all users of the db",
    response: { schema: ExampleArrays.UserArray, failAction: validationError },
  },

  findOne: {
    auth: {
        strategy: "jwt",
    },
    handler: async (request) => {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) return Boom.notFound("No user with the given id");
        return user;
      } catch (err) {
          return Boom.serverUnavailable("Database Error - No user with the given id");
      }
    },
    tags: ["api", "user"],
    description: "Get one user",
    notes: "Returns one specific user with its ID",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: UserDBSpec, failAction: validationError },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async (request, h) => {
      try {
        const requestingUser = request.auth.credentials;
        const success = await db.userStore.deleteUserById(request.params.id, requestingUser);
        switch (success) {
          case -1: return Boom.badRequest("Missing rights to delete this user.");
          case 0: return Boom.badImplementation(`No user with id ${request.params.id} => could not be deleted`);
          default: return h.response(success).code(204);
        }
      } catch (err) {
          return Boom.serverUnavailable(`Missing rights or Database Error - error deleting the user with id ${request.params.id}`);
      }
    },
    tags: ["api", "user"],
    description: "Deletes a user",
    notes: "Deletes a specific user when the command is executed by an Admin (rank of authorized user).",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    auth: {
        strategy: "jwt",
    },
    handler: async (request, h) => {
        try {
          const requestingUser = request.auth.credentials;
          const success = await db.userStore.deleteAll(requestingUser);
          switch (success) {
            case -1: return Boom.badRequest("Missing right to delete all users.");
            default: return h.response(success).code(204);
          }
        } catch (err) {
          return Boom.serverUnavailable("Database Error - No users in Database");
        }
    },
    tags: ["api", "user"],
    description: "Deletes all users",
    notes: "Deletes all users when the command is executed by an Admin (rank of authorized user).",
  },

  authenticate: {
      auth: false,
      handler: async (request, h) => {
        try {
          const user = await db.userStore.getUserByUsername(request.payload.username);
          if (!user) {
            return Boom.unauthorized("User not found");
          } if (user.password !== request.payload.password) {
            return Boom.unauthorized("Invalid password");
          }
          return h.response({ success: true, token: createToken(user), _id: user._id }).code(201);
        } catch (err) {
            return Boom.serverUnavailable("Database Error");
        }
      },
      tags: ["api", "user"],
      description: "Authenticate a user",
      notes: "The User is determines with his rank which of the API commands a later available",
      validate: { payload: UserLoginSpec, failAction: validationError },
      response: { schema: AuthSpec, failAction: validationError },
    },
};

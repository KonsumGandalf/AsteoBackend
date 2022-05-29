import Boom from "@hapi/boom";
import { db } from "../models/db.js";
/* import {
 UserRegisterTemplateSpec, UserRegisterSpec, ExampleArrays, IdSpec, AuthSpec, UserLoginSpec
} from "../models/joi-schemas.js"; */
// import { validationError } from "./logger.js";
import { createToken } from "./jwt-utils.js";

export const usersApi = {
    create: {
        auth: false,
        handler: async (request, h) => {
            try {
              const user = await db.userStore.createUser(request.payload);
              console.log(request.payload);
                if (user) {
                    return h.response(user).code(201);
                }
                return Boom.badImplementation("Error creating user");
            } catch (err) {
                return Boom.serverUnavailable("Database Error - error creating user");
            }
        },
        tags: ["api"],
        description: "Create a user",
        notes: "Returns the created user",
        /* validate: { payload: UserRegisterTemplateSpec, failAction: validationError },
        response: { schema: UserRegisterSpec, failAction: validationError }, */
    },

    findAll: {
        auth: false,
        handler: async () => {
            try {
                const users = await db.userStore.getAllUsers();
                if (users) return users;
                return Boom.notFound("No users in the Database");
            } catch (err) {
                return Boom.serverUnavailable("Database Error - No users in the Database");
            }
        },
        tags: ["api"],
        description: "Get all users of the db",
        notes: "Returns all users",
        // response: { schema: ExampleArrays.UserArray, failAction: validationError },
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
        tags: ["api"],
        description: "Get one user of the db",
        notes: "Returns one specific users",
        /* validate: { params: { id: IdSpec }, failAction: validationError },
        response: { schema: UserRegisterSpec, failAction: validationError }, */
    },

    deleteOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async (request, h) => {
            try {
                // eslint-disable-next-line max-len
                const success = await db.userStore.deleteUserById(request.params.id, request.auth.credentials);
                switch (success) {
                  case -1: return Boom.badRequest("Missing rights to delete this user.");
                  case 0: return Boom.badImplementation(`No user with id ${request.params.id} => could not be deleted`);
                  default: return h.response(success).code(204);
                }
            } catch (err) {
                return Boom.serverUnavailable(`Missing rights or Database Error - error deleting the user with id ${request.params.id}`);
            }
        },
        tags: ["api"],
        description: "Deletes the user with the given id",
        notes: "Returns success-condition of the deletion",
        // validate: { params: { id: IdSpec }, failAction: validationError },
    },

    deleteAll: {
      auth: {
          strategy: "jwt",
      },
      handler: async (request, h) => {
          try {
            const user = request.auth.credentials;
            const success = await db.userStore.deleteAll(user);
            switch (success) {
              case -1: return Boom.badRequest("Missing right to delete all users.");
              case 0: return Boom.badImplementation(`No user with id ${request.params.id} => could not be deleted`);
              default: return h.response(success).code(204);
            }
            } catch (err) {
              return Boom.serverUnavailable("Database Error - No users in Database");
            }
      },
      tags: ["api"],
      description: "Deletes all users of the db",
      notes: "Returns nothing",
    },

    authenticate: {
        auth: false,
        handler: async (request, h) => {
          try {
            const user = await db.userStore.getUserByUsername(request.payload.username);
            console.log(user);
            if (!user) {
              return Boom.unauthorized("User not found");
            } if (user.password !== request.payload.password) {
              return Boom.unauthorized("Invalid password");
            }
            return h.response({ success: true, token: createToken(user) }).code(201);
          } catch (err) {
              console.log("test");
              return Boom.serverUnavailable("Database Error");
          }
        },
        tags: ["api"],
        description: "Authenticate a user to have access to the api",
        notes: "Returns the authenticated user",
        /* validate: { payload: UserLoginSpec, failAction: validationError },
        response: { schema: AuthSpec, failAction: validationError }, */
      },
};

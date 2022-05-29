import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Cookie from "@hapi/cookie";
import Inert from "@hapi/inert";
import HapiSwagger from "hapi-swagger";
import Joi from "joi";
import dotenv from "dotenv";
import jwt from "hapi-auth-jwt2";
import { validate } from "./api/jwt-utils.js";
import { apiRoutes } from "./api-routes.js";
import { db } from "./models/db.js";

// const __filename = fileURLToPath(import.meta.url); needed for implementing handlebars pageControl
// const __dirname = path.dirname(__filename);

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
}

const swaggerOptions = {
  info: {
    title: "CAD Playtime",
    version: "0.1",
  },
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  security: [{ jwt: [] }],
};

async function init() {
  const server = Hapi.server({
    port: process.env.port,
  });
  // later : implement auth strategies

  await server.register([
    Vision,
    Inert,
    Cookie,
    jwt,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  server.validator(Joi);

  server.auth.strategy("jwt", "jwt", {
    key: process.env.password,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] },
  });
  server.auth.default("jwt");

  db.init();
  server.route(apiRoutes);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

await init();

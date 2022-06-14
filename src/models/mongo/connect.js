import mongoose from "mongoose";
import * as dotenv from "dotenv";

import * as seeder from "mais-mongoose-seeder";
import { seedData } from "./seed-data.js";

async function seed() {
  const seedObj = seeder.default(mongoose);
  await seedObj.seed(seedData, { dropDatabase: false, dropCollections: true });
  // console.log(dbData);
}

export function connectMongo() {
  dotenv.config();

  mongoose.connect(process.env.db);
  const db = mongoose.connection;

  db.on("error", (err) => {
    console.log(`database connection error: ${err}`);
  });

  db.on("disconnected", () => {
    console.log("database disconnected");
  });

  db.once("open", function () {
    console.log(`database connected to ${this.name} on ${this.host}`);
    seed();
  });
}

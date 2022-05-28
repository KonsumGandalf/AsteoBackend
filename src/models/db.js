import { connectMongo } from "./mongo/connect.js";
import { artistMongoStore } from "./mongo/store/artist-store.js";
import { epochMongoStore } from "./mongo/store/epoch-store.js";
import { galleryMongoStore } from "./mongo/store/gallery-store.js";
import { paintingMongoStore } from "./mongo/store/painting-store.js";
import { postMongoStore } from "./mongo/store/post-store.js";
import { userMongoStore } from "./mongo/store/user-store.js";

export const db = {
  artistStore: null,
  epochStore: null,
  galleryStore: null,
  paintingStore: null,
  postStore: null,
  userStore: null,

  init() {
    this.artistStore = artistMongoStore;
    this.epochStore = epochMongoStore;
    this.galleryStore = galleryMongoStore;
    this.paintingStore = paintingMongoStore;
    this.postStore = postMongoStore;
    this.userStore = userMongoStore;
    connectMongo();
  },
};

import { artistsApi } from './api/artist-api.js';
import { epochsApi } from './api/epoch-api.js';
import { galleriesApi } from './api/gallery-api.js';
import { postsApi } from './api/post-api.js';
import { usersApi } from './api/users-api.js';
import { paintingsApi } from './api/painting-api.js';

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: usersApi.findAll },
  { method: "GET", path: "/api/users/{id}", config: usersApi.findOne },
  { method: "POST", path: "/api/users", config: usersApi.create },
  { method: "DELETE", path: "/api/users", config: usersApi.deleteAll },
  { method: "DELETE", path: "/api/users/{id}", config: usersApi.deleteOne },
  { method: "POST", path: "/api/users/authenticate", config: usersApi.authenticate },

  { method: "GET", path: "/api/users/{userId}/posts", config: postsApi.findAll },

  { method: "GET", path: "/api/artists", config: artistsApi.findAll },
  { method: "GET", path: "/api/artists/{id}", config: artistsApi.findOne },
  { method: "POST", path: "/api/artists", config: artistsApi.create },
  { method: "DELETE", path: "/api/artists", config: artistsApi.deleteAll },
  { method: "DELETE", path: "/api/artists/{id}", config: artistsApi.deleteOne },

  { method: "GET", path: "/api/artists/{artistId}/paintings", config: paintingsApi.findAll },

  { method: "GET", path: "/api/epochs", config: epochsApi.findAll },
  { method: "GET", path: "/api/epochs/{id}", config: epochsApi.findOne },
  { method: "POST", path: "/api/epochs", config: epochsApi.create },
  { method: "DELETE", path: "/api/epochs", config: epochsApi.deleteAll },
  { method: "DELETE", path: "/api/epochs/{id}", config: epochsApi.deleteOne },

  { method: "GET", path: "/api/epochs/{epochId}/paintings", config: paintingsApi.findAll },

  { method: "GET", path: "/api/galleries", config: galleriesApi.findAll },
  { method: "GET", path: "/api/galleries/{id}", config: galleriesApi.findOne },
  { method: "POST", path: "/api/galleries", config: galleriesApi.create },
  { method: "DELETE", path: "/api/galleries", config: galleriesApi.deleteAll },
  { method: "DELETE", path: "/api/galleries/{id}", config: galleriesApi.deleteOne },

  { method: "GET", path: "/api/galleries/{galleryId}/paintings", config: paintingsApi.findAll },

  { method: "GET", path: "/api/galleries/{galleryId}/posts", config: postsApi.findAll },
  { method: "POST", path: "/api/galleries/{galleryId}/posts", config: postsApi.create }, // POST !

  { method: "GET", path: "/api/posts", config: postsApi.findAll },
  { method: "GET", path: "/api/posts/{id}", config: postsApi.findOne },
  { method: "DELETE", path: "/api/posts", config: postsApi.deleteAll },
  { method: "DELETE", path: "/api/posts/{id}", config: postsApi.deleteOne },

  { method: "GET", path: "/api/paintings", config: paintingsApi.findAll },
  { method: "GET", path: "/api/paintings/{id}", config: paintingsApi.findOne },
  { method: "POST", path: "/api/paintings", config: paintingsApi.create },
  { method: "DELETE", path: "/api/paintings", config: paintingsApi.deleteAll },
  { method: "DELETE", path: "/api/paintings/{id}", config: paintingsApi.deleteOne },
];

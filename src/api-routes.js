import { artistsApi } from './api/artist-api.js';
import { usersApi } from './api/users-api.js';

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: usersApi.findAll },
  { method: "GET", path: "/api/users/{id}", config: usersApi.findOne },
  { method: "POST", path: "/api/users", config: usersApi.create },
  { method: "DELETE", path: "/api/users", config: usersApi.deleteAll },
  { method: "DELETE", path: "/api/users/{id}", config: usersApi.deleteOne },
  { method: "POST", path: "/api/users/authenticate", config: usersApi.authenticate },

  { method: "GET", path: "/api/artists", config: artistsApi.findAll },
  { method: "GET", path: "/api/artists/{id}", config: artistsApi.findOne },
  { method: "POST", path: "/api/artists", config: artistsApi.create },
  { method: "DELETE", path: "/api/artists", config: artistsApi.deleteAll },
  { method: "DELETE", path: "/api/artists/{id}", config: artistsApi.deleteOne },
];

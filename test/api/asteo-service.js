import axios from "axios";
import { serviceUrl } from "../fixtures.spec.js";

export const userService = {
  async createUser(user) {
    const res = await axios.post(`${serviceUrl}/api/users`, user);
    return res.data;
  },

  async updateUser(user) {
    const res = await axios.post(`${serviceUrl}/api/users/update`, user);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${serviceUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${serviceUrl}/api/users`);
    return res.data;
  },

  async deleteUser(id) {
    const res = await axios.delete(`${serviceUrl}/api/users/${id}`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${serviceUrl}/api/users`);
    return res.data;
  },

  async authenticate(user) {
    const res = await axios.post(`${serviceUrl}/api/users/authenticate`, user);
    axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
    return res.data;
  },

  async clearAuth() {
    axios.defaults.headers.common.Authorization = "";
  },
};

export const artistService = {
  async createArtist(artist) {
    const res = await axios.post(`${serviceUrl}/api/artists`, artist);
    return res.data;
  },

  async getArtist(id) {
    const res = await axios.get(`${serviceUrl}/api/artists/${id}`);
    return res.data;
  },

  async getAllArtists() {
    const res = await axios.get(`${serviceUrl}/api/artists`);
    return res.data;
  },

  async deleteArtist(id) {
    const res = await axios.delete(`${serviceUrl}/api/artists/${id}`);
    return res.data;
  },

  async deleteAllArtists() {
    const res = await axios.delete(`${serviceUrl}/api/artists`);
    return res.data;
  },
};

export const epochService = {
  async createEpoch(epoch) {
    const res = await axios.post(`${serviceUrl}/api/epochs`, epoch);
    return res.data;
  },

  async getEpoch(id) {
    const res = await axios.get(`${serviceUrl}/api/epochs/${id}`);
    return res.data;
  },

  async getAllEpochs() {
    const res = await axios.get(`${serviceUrl}/api/epochs`);
    return res.data;
  },

  async deleteEpoch(id) {
    const res = await axios.delete(`${serviceUrl}/api/epochs/${id}`);
    return res.data;
  },

  async deleteAllEpochs() {
    const res = await axios.delete(`${serviceUrl}/api/epochs`);
    return res.data;
  },
};

export const galleryService = {
  async createGallery(gallery) {
    const res = await axios.post(`${serviceUrl}/api/galleries`, gallery);
    return res.data;
  },

  async checkIn(id) {
    const res = await axios.post(`${serviceUrl}/api/galleries/${id}/checkIn`);
    return res.data;
  },

  async checkOut(id) {
    const res = await axios.post(`${serviceUrl}/api/galleries/${id}/checkOut`);
    return res.data;
  },

  async getGallery(id) {
    const res = await axios.get(`${serviceUrl}/api/galleries/${id}`);
    return res.data;
  },

  async getAllGalleries() {
    const res = await axios.get(`${serviceUrl}/api/galleries`);
    return res.data;
  },

  async deleteGallery(id) {
    const res = await axios.delete(`${serviceUrl}/api/galleries/${id}`);
    return res.data;
  },

  async deleteAllGalleries() {
    const res = await axios.delete(`${serviceUrl}/api/galleries`);
    return res.data;
  },
};

export const postService = {
  async createPost(galleryId, post) {
    const res = await axios.post(`${serviceUrl}/api/galleries/${galleryId}/posts`, post);
    return res.data;
  },

  // PLEASE LOOK FOR ERRORS with the smaller url
  async getPost(id) {
    const res = await axios.get(`${serviceUrl}/api/posts/${id}`);
    return res.data;
  },

  async getAllPosts() {
    const res = await axios.get(`${serviceUrl}/api/posts`);
    return res.data;
  },

  async getAllPostsByGallery(galleryId) {
    const res = await axios.get(`${serviceUrl}/api/galleries/${galleryId}/posts`);
    return res.data;
  },

  async getAllPostsByUser(userId) {
    const res = await axios.get(`${serviceUrl}/api/users/${userId}/posts`);
    return res.data;
  },

  async deletePost(id) {
    const res = await axios.delete(`${serviceUrl}/api/posts/${id}`);
    return res.data;
  },

  async deleteAllPosts() {
    const res = await axios.delete(`${serviceUrl}/api/posts`);
    return res.data;
  },
};

export const paintingService = {
  async createPainting(painting) {
    const res = await axios.post(`${serviceUrl}/api/paintings`, painting);
    return res.data;
  },

  // PLEASE LOOK FOR ERRORS with the shorter url
  async getPainting(id) {
    const res = await axios.get(`${serviceUrl}/api/paintings/${id}`);
    return res.data;
  },

  async getAllPaintings() {
    const res = await axios.get(`${serviceUrl}/api/paintings`);
    return res.data;
  },

  async getAllPaintingsByGallery(galleryId) {
    const res = await axios.get(`${serviceUrl}/api/galleries/${galleryId}/paintings`);
    return res.data;
  },

  async getAllPaintingsByArtist(artistId) {
    const res = await axios.get(`${serviceUrl}/api/artists/${artistId}/paintings`);
    return res.data;
  },

  async getAllPaintingsByEpoch(epochId) {
    const res = await axios.get(`${serviceUrl}/api/epochs/${epochId}/paintings`);
    return res.data;
  },

  async deletePainting(id) {
    const res = await axios.delete(`${serviceUrl}/api/paintings/${id}`);
    return res.data;
  },

  async deleteAllPaintings() {
    const res = await axios.delete(`${serviceUrl}/api/paintings`);
    return res.data;
  },
};

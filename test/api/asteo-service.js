import axios from "axios";
import { serviceUrl } from "../fixtures.spec.js";

export const userService = {

  async createUser(user) {
      const res = await axios.post(`${serviceUrl}/api/users`, user);
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
    console.log(epoch.yearSpan);
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

export function consoleMan(input, output) {
  console.log("Console Man");
  console.log(input);
  console.log(output);
}

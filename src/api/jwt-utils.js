import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../models/db.js";

dotenv.config();

export function createToken(user) {
  const payload = {
    id: user._id,
    username: user.username,
  };
  const options = {
    algorithm: "HS256",
    expiresIn: "1h",
  };
  return jwt.sign(payload, process.env.password, options);
}

export function decodeToken(token) {
  const userInfo = {};
  try {
    const decodedInfo = jwt.verify(token, process.env.password);
    userInfo.userId = decodedInfo.id;
    userInfo.username = decodedInfo.username;
  } catch (e) {
    console.log(e.message);
  }
  console.log(token);
  return userInfo;
}

export async function validate(decoded, request) { // unnecessary parameter
  const user = await db.userStore.getUserById(decoded.id);
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: user };
}

import jwt from "jsonwebtoken";
import client from "./connect-redis.js";

export const signAccessToken = (user) => {
  const payload = { id: user.id };
  const secrets = process.env.ACCESS_TOKEN_SECRET;
  const options = { expiresIn: process.env.ACCESS_TOKEN_TIME };
  const accessToken = jwt.sign(payload, secrets, options);
  return accessToken;
};

export const signRefreshToken = (user) => {
  const payload = { id: user.id };
  const secrets = process.env.REFRESH_TOKEN_SECRET;
  const options = { expiresIn: process.env.REFRESH_TOKEN_TIME };
  const refreshToken = jwt.sign(payload, secrets, options);
  client.set(user.id, refreshToken);
  return refreshToken;
};

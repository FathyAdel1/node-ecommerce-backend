import jwt from "jsonwebtoken";

export const verifyRefreshToken = (refreshToken) => {
  const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  return payload;
};

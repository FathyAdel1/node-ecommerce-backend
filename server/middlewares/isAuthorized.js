import jwt from "jsonwebtoken";

export const isAuthorized = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(404).json({ err: "Access token not found!" });
    }
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ err: "Token is expired!" });
  }
};

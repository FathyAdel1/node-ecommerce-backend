import { User } from "../models/User.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.isAdmin) {
      next();
    } else {
      return res.status(400).json({ err: "User is not admin!" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

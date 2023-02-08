import express from "express";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { signup } from "../controllers/auth.js";
import { login } from "../controllers/auth.js";
import { refreshToken } from "../controllers/auth.js";
import { logout } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.delete("/logout", isAuthorized, logout);

export default router;

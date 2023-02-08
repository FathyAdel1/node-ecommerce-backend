import express from "express";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { getUsers } from "../controllers/users.js";
import { getUser } from "../controllers/users.js";
import { resetPassword } from "../controllers/users.js";
import { resetName } from "../controllers/users.js";
import { blockUser } from "../controllers/users.js";
import { unblockUser } from "../controllers/users.js";
import { deleteUser } from "../controllers/users.js";
import { forgotPassword } from "../controllers/users.js";
import { resetForgotPassword } from "../controllers/users.js";

const router = express.Router();

router.get("/", isAuthorized, isAdmin, getUsers);
router.get("/:id", isAuthorized, getUser);
router.put("/reset-password", isAuthorized, resetPassword);
router.put("/reset-name", isAuthorized, resetName);
router.put("/:id/block", isAuthorized, isAdmin, blockUser);
router.put("/:id/unblock", isAuthorized, isAdmin, unblockUser);
router.delete("/:id", isAuthorized, isAdmin, deleteUser);
router.post("/forgot-password", isAuthorized, forgotPassword);
router.put("/forgot-password/:token", isAuthorized, resetForgotPassword);

export default router;

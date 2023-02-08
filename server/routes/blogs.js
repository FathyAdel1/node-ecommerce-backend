import express from "express";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { getBlogs } from "../controllers/blogs.js";
import { getBlog } from "../controllers/blogs.js";
import { createBlog } from "../controllers/blogs.js";
import { updateBlog } from "../controllers/blogs.js";
import { deleteBlog } from "../controllers/blogs.js";
import { addLike } from "../controllers/blogs.js";
import { deleteLike } from "../controllers/blogs.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlog);
router.post("/", isAuthorized, isAdmin, createBlog);
router.put("/:id", isAuthorized, isAdmin, updateBlog);
router.delete("/:id", isAuthorized, deleteBlog);
router.put("/:id/add-like", isAuthorized, addLike);
router.put("/:id/delete-like", isAuthorized, deleteLike);

export default router;

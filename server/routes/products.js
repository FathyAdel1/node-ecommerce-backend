import express from "express";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { getProducts } from "../controllers/products.js";
import { getProduct } from "../controllers/products.js";
import { createProduct } from "../controllers/products.js";
import { updateProduct } from "../controllers/products.js";
import { deleteProduct } from "../controllers/products.js";
import { addRating } from "../controllers/products.js";
import { deleteRating } from "../controllers/products.js";

const router = express.Router();

router.get("/", isAuthorized, getProducts);
router.get("/:id", isAuthorized, getProduct);
router.post("/", isAuthorized, isAdmin, createProduct);
router.put("/:id", isAuthorized, isAdmin, updateProduct);
router.delete("/:id", isAuthorized, isAdmin, deleteProduct);
router.put("/:id/add-rating", isAuthorized, addRating);
router.put("/:id/delete-rating", isAuthorized, deleteRating);

export default router;

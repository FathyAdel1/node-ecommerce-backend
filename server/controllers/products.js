import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { validateCreateProduct } from "../validation/products.js";
import { validateUpdateProduct } from "../validation/products.js";
import { validateAddRating } from "../validation/products.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "product ID is not valid!" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ err: "Product not found!" });
    }

    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const createProduct = async (req, res) => {
  try {
    const { error } = validateCreateProduct(req.body);

    if (error) {
      return res.status(400).json({ err: error.details[0].message });
    }

    const newProduct = await Product.create(req.body);

    return res.status(201).json(newProduct);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "product ID is not valid!" });
    }

    const { error } = validateUpdateProduct(req.body);

    if (error) {
      return res.status(400).json({ err: error.details[0].message });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(400).json({ err: "Product not found!" });
    }

    return res.status(201).json(updatedProduct);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "product ID is not valid!" });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(400).json({ err: "Product already deleted!" });
    }

    return res.status(200).json(deletedProduct);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addRating = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "product ID is not valid!" });
    }

    const { error } = validateAddRating(req.body);

    if (error) {
      return res.status(400).json({ err: error.details[0].message });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ err: "Product not found!" });
    }

    const isRated = product.ratings.find((item) => {
      return item.postedBy == req.user.id;
    });

    if (isRated) {
      return res.status(200).json({ msg: "Product already rated!" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          ratings: {
            star: req.body.star,
            comment: req.body.comment,
            postedBy: req.user.id,
          },
        },
      },
      { new: true }
    );

    return res.status(200).json(updatedProduct);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const deleteRating = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "product ID is not valid!" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ err: "Product not found!" });
    }

    const isRated = product.ratings.find((item) => {
      return item.postedBy == req.user.id;
    });

    if (!isRated) {
      return res.status(200).json({ msg: "Product already unrated!" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          ratings: {
            postedBy: req.user.id,
          },
        },
      },
      { new: true }
    );

    return res.status(200).json(updatedProduct);
  } catch (err) {
    return res.status(500).json(err);
  }
};

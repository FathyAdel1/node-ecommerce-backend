import mongoose from "mongoose";
import { Blog } from "../models/Blog.js";
import { validateCreateBlog } from "../validation/blogs.js";
import { validateUpdateBlog } from "../validation/blogs.js";

export const createBlog = async (req, res) => {
  try {
    const { error } = validateCreateBlog(req.body);

    if (error) {
      return res.status(400).json({ err: error.details[0].message });
    }

    const newBlog = await Blog.create(req.body);

    return res.status(201).json(newBlog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    return res.status(200).json(blogs);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getBlog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "Blog ID is not valid" });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ err: "Blog not found!" });
    }

    await blog.updateOne({ $inc: { numViews: 1 } });

    return res.status(200).json(blog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const updateBlog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "Blog ID is not valid" });
    }

    const { error } = validateUpdateBlog(req.body);

    if (error) {
      return res.status(400).json({ err: error.details[0].message });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(400).json({ err: "Blog not found!" });
    }

    return res.status(200).json(updatedBlog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const deleteBlog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "Blog ID is not valid" });
    }

    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      return res.status(404).json({ err: "Blog already deleted!" });
    }

    return res.status(200).json(deletedBlog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addLike = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "Blog ID is not valid" });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ err: "Blog not found!" });
    }

    if (blog.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: "Already liked this blog" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          likes: req.user.id,
        },
      },
      { new: true }
    );

    return res.status(200).json(updatedBlog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const deleteLike = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "Blog ID is not valid" });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ err: "Blog not found!" });
    }

    if (!blog.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: "Already unliked this blog" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          likes: req.user.id,
        },
      },
      { new: true }
    );

    return res.status(200).json(updatedBlog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

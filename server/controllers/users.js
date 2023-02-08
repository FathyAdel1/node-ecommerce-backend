import mongoose from "mongoose";
import client from "../config/connect-redis.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { sendMail } from "../config/mailgun.js";
import { validateResetPassword } from "../validation/users.js";
import { validateResetName } from "../validation/users.js";
import { signAccessToken } from "../config/jwt-tokens.js";
import { validateForgetPassword } from "../validation/users.js";
import { validateResetForgotPassword } from "../validation/users.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "User ID is not valid!" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ err: "User not found!" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { error } = validateResetPassword(req.body);

    if (error) {
      return res.status(400).json({ err: error.details[0].message });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const resetName = async (req, res) => {
  try {
    const { error } = validateResetName(req.body);

    if (error) {
      return res.status(400).json({ err: error.details[0].message });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          username: req.body.username,
        },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const blockUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "User ID is not valid!" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ err: "User not found!" });
    }

    if (user.isBlocked) {
      return res.status(400).json({ err: "User already blocked!" });
    }

    const blockedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isBlocked: true,
        },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(blockedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const unblockUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "User ID is not valid!" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ err: "User not found!" });
    }

    if (!user.isBlocked) {
      return res.status(400).json({ err: "User already unblocked!" });
    }

    const unblockedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isBlocked: false,
        },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(unblockedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ err: "User ID is not valid!" });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id).select(
      "-password"
    );

    if (!deletedUser) {
      return res.status(400).json({ err: "User already deleted!" });
    }

    await client.del(deletedUser.id);

    return res.status(200).json(deletedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { error } = validateForgetPassword(req.body);

    if (error) {
      return res.status(400).json({ err: error.details[0].message });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ err: "email not found!" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ err: "User not found!" });
    }
    const accessToken = signAccessToken(user);

    //will send mail to the client route and then the client will send
    //put request to the server with the password field
    const mail = `http://localhost:3000/api/users/forgot-password/${accessToken}`;

    sendMail(mail);
    return res.status(200).json({ msg: "Send email successfully!" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const resetForgotPassword = async (req, res) => {
  try {
    const { error } = validateResetForgotPassword(req.body);

    if (error) {
      return res.status(400).json({ err: error.details[0].message });
    }

    const { token } = req.params;

    const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ err: "User not found!" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        $set: { password: hashedPassword },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
};

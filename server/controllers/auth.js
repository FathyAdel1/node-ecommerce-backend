import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { validateSignup } from "../validation/auth.js";
import { validateLogin } from "../validation/auth.js";
import { signAccessToken } from "../config/jwt-tokens.js";
import { signRefreshToken } from "../config/jwt-tokens.js";
import { verifyRefreshToken } from "../config/verify-jwt.js";
import client from "../config/connect-redis.js";

export const signup = async (req, res) => {
  try {
    const { error } = validateSignup(req.body);

    if (error) {
      return res.status(400).json(error);
    }

    const isExist = await User.findOne({ email: req.body.email });

    if (!isExist) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
        email: req.body.email.toLowerCase(),
      });

      const accessToken = signAccessToken(newUser);
      const refreshToken = signRefreshToken(newUser);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });

      const { password, ...others } = newUser._doc;

      return res.status(201).json(others);
    }

    return res.status(400).json({ err: "User already exist!" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);

    if (error) {
      return res.status(400).json(error);
    }

    const isExist = await User.findOne({ email: req.body.email });

    if (!isExist) {
      return res.status(404).json({ err: "User not found!" });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      isExist.password
    );

    if (!isValidPassword) {
      return res.status(400).json({ err: "Password is not valid!" });
    }

    const accessToken = signAccessToken(isExist);
    const refreshToken = signRefreshToken(isExist);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const { password, ...others } = isExist._doc;

    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshTokenBody = req.cookies.refreshToken;

    if (!refreshTokenBody) {
      return res.status(404).json({ err: "Token not found!" });
    }

    const payload = verifyRefreshToken(refreshTokenBody);

    const redisToken = await client.get(payload.id);

    if (redisToken !== refreshTokenBody) {
      return res.status(401).json({ err: "Token is not valid!" });
    }

    const user = await User.findById(payload.id);

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return res.status(200).json({ msg: "Refresh successfully!" });
  } catch (err) {
    return res.status(403).json({ err: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    const payload = verifyRefreshToken(refreshToken);

    const redisToken = await client.get(payload.id);

    if (redisToken !== refreshToken) {
      return res.status(401).json({ err: "Token is not valid!" });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    await client.del(payload.id);

    return res.sendStatus(204);
  } catch (err) {
    return res.status(403).json({ err: err.message });
  }
};

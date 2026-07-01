import jwt from "jsonwebtoken";

import env from "../config/env.js";
import ApiError from "../lib/ApiError.js";

import {
  findUserById,
} from "../repositories/user.repository.js";

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET || env.ACCESS_TOKEN_SECRET
    );

    const user = await findUserById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (!user.isEmailVerified) {
      throw new ApiError(
        403,
        "Please verify your email first"
      );
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
import ApiError from "../lib/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt.js";

import {
  findUserById,
  updateUserById,
} from "../repositories/user.repository.js";

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  const payload = verifyRefreshToken(refreshToken);

  const user = await findUserById(payload.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const newAccessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  const newRefreshToken = generateRefreshToken({
    id: user._id,
    role: user.role,
  });

  await updateUserById(user._id, {
    refreshToken: newRefreshToken,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
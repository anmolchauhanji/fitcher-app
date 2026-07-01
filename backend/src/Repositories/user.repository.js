import User from "../models/user.model.js";

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findUserById = async (userId) => {
  return await User.findById(userId);
};

export const findUserByEmail = async (email) => {
  const normalizedEmail = email?.trim()?.toLowerCase();

  return await User.findOne({ email: normalizedEmail }).select(
    "+emailVerificationOTP +emailVerificationOTPExpiry"
  );
};

export const findUserByEmailWithPassword = async (email) => {
  const normalizedEmail = email?.trim()?.toLowerCase();

  return await User.findOne({ email: normalizedEmail }).select("+password");
};

export const findUserByEmailWithOTP = async (email) => {
  const normalizedEmail = email?.trim()?.toLowerCase();

  return await User.findOne({ email: normalizedEmail }).select(
    "+emailVerificationOTP +emailVerificationOTPExpiry"
  );
};

export const updateUserById = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteUserById = async (userId) => {
  return await User.findByIdAndDelete(userId);
};


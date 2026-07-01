import { compare, hash } from "bcrypt";

const SALTROUND = 10;

export const hashPassword = (value) => {
  return hash(value, SALTROUND);
};

export const comparePassword = async (value, hashedValue) => {
  if (!value || !hashedValue) {
    return false;
  }

  return compare(value, hashedValue);
};
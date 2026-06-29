import { compare, hash } from "bcrypt";

const SALTROUND = 10;

export const hashPassword = (value) => {
  return hash(value, SALTROUND);
};

export const Comparevalue = async (value, hashedvalue) => {
  if (!value || !hashedvalue) {
    return false;
  }

  return compare(value, hashedvalue);
};
import { compare, hash } from "bcrypt";

const SALTROUND = 10;

export const generateOTP = ()=>{
    const otp =  (Math.floor(100000+Math.random()*900000)).toString()
    console.log(otp);
    return otp
}
export const hashOTP = (value) => {
  return hash(value, SALTROUND);
};

export const compareOTP = async (value, hashedvalue) => {
  if (!value || !hashedvalue) {
    return false;
  }

  return compare(value, hashedvalue);
};
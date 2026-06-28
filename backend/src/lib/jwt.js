import jwt from "jsonwebtoken";
import env from "../config/env.js"
export const generateAccessToken =  (payload) => {
    return jwt.sign(payload,env.JWT_ACCESS_SECRET,
        {expiresIn:env.JWT_ACCESS_EXPIRES_IN})
}



export const generateRefreshToken = (payload)=>{
    return jwt.sign(payload,env.JWT_REFRESH_SECRET,
        {expiresIn:env.JWT_REFRESH_EXPIRES_IN})
}


export const verifytoken = (token)=>{
    return jwt.verify(token,env.JWT_ACCESS_SECRET)
}
export const verifyrefreshtoken = (token)=>{
    return jwt.verify(token,env.JWT_REFRESH_SECRET)
}
import jwt, { sign ,verify} from "jsonwebtoken";
import env from "../config/env"
export const generateAccessToken =  (payload) => {
    return sign(payload,env.JWT_ACCESS_SECRET,
        {expiresIn:env.JWT_ACCESS_EXPIRES_IN})
}



export const generateRefreshToken = (payload)=>{
    return sign(payload,env.JWT_REFRESH_SECRET,
        {expiresIn:env.JWT_REFRESH_EXPIRES_IN})
}


export const verifytoken = (token)=>{
    return verify(token,env.JWT_ACCESS_SECRET)
}
export const verifyrefreshtoken = (token)=>{
    return verify(token,env.JWT_REFRESH_SECRET)
}
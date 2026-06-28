import asynchandler from "../lib/asynhandler.js";
import { successResponse } from "../lib/response.js";
import { LoginService, signupService } from "../service/auth.service.js";
import { emailVerification } from "../service/email.service.js";
export const signup = asynchandler(async (req,res) => {
    const result = await signupService(req.body)
    return successResponse(res,result,"user created succesfully")
})

export const verifyEmail = asynchandler(async (req,res) => {
    const {email,otp} = req.body
   const result= await emailVerification({
        email,
        otp
    })

    return  successResponse(
        res,
        
        result,
        "email verified succesfully"
    )
})

export const Login = asynchandler(async (req,res) => {
    const result = await LoginService(req.body)
    return successResponse(res,result,"User loggedIn succesfully")
})
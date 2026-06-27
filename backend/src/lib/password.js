import bcrypt, { compare, hash } from "bcrypt"
const SALTROUND = 10

//HASH PASSWD
export const hashpassword = async (password) => {
    return await hash(password,SALTROUND)
}
//compare password
export const comparepassword  = async (password,hashedpassword) => {
return await compare(password,hashedpassword)
}
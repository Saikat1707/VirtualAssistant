import { logInDao, signUpDao } from "../DAO/AuthDao.js"
import { generateToken } from "../utils/generateToken.js";
import { cookieOptions } from "../utils/cookieOptions.js";

export const SignUp = async(req,res)=>{
    const {userName , email , password} = req.body
    if(!userName || !email || !password) return res.status(400).json({message:"All fields are required"})
    const userJson = await signUpDao(userName, email, password);
    return res.status(userJson.status).json({
        message: userJson.message,
        data: userJson.data || null,
        error: userJson.error || null
    })
}

export const logIn = async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password) return res.status(400).json({message:"All fields are required"})
    const userJson = await logInDao(email,password)
    if(userJson.data){
        const token = userJson.data ? generateToken(userJson.data._id) : null
        res.cookie("token", token,cookieOptions());
    }
    return res.status(userJson.status).json({
        message: userJson.message,
        data: userJson.data || null,
        error: userJson.error || null
    })

}
export const logOut = async(req,res)=>{
    res.clearCookie("token", cookieOptions());
    return res.status(200).json({message:"Logout successful"});
}
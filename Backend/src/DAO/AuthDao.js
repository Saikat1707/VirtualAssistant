import userModel from '../models/user.models.js';
import {hashPassword} from '../utils/hashedPassword.js';
import { comparePassword } from '../utils/passwordValidation.js';

export const signUpDao = async (userName,email,password)=>{
    try {
        const existEmail = await userModel.findOne({email});
        if(existEmail){
            return {status:400,message:"Email already exists"};
        }
        const hashedPassword = await hashPassword(password);

        const newUser = await userModel.create({
            userName,
            email,
            password:hashedPassword
        });
        return {status:201,message:"User created successfully",data:newUser};
    } catch (error) {
        return {status:500,message:"Internal server error",error:error.message};
    }
}


export const logInDao = async (email , password)=>{
    try {
        const user =  await userModel.findOne({email});
        if(!user) return {status:404,message:"User not found with this email"};
        const isValid = await comparePassword(password,user.password);
        if(!isValid) return {status:400,message:"Invalid Login credentials"};

        return {status:200,message:"Login successful",data:user};


    } catch (error) {
        return {status:500,message:"Internal server error",error:error.message};
    }
}

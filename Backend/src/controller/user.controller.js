import { updateDao } from "../DAO/updateDao.js";

export const getCurrentUser = (req,res)=>{
    const user = req.user
    if(!user){
        return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(201).json({message: "user retrieved successfully",data:user})
}

export const updateUser = async (req,res)=>{
    const {virtualAssistantName} = req.body
    const localFilePath = req.file?.path || null
    const user = req.user
    if(!user){
        return res.status(401).json({ message: "Unauthorized" });
    }
    if(!virtualAssistantName){
        return res.status(400).json({ message: "Virtual Assistant Name is required" });
    }
    const updatedUser = await updateDao(user._id,virtualAssistantName,localFilePath)
    if(!updatedUser){
        return res.status(500).json({ message: "Failed to update user" });
    }
    return res.status(200).json({message: "User updated successfully",data:updatedUser})
}
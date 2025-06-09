import userModel from "../models/user.models.js";
import { uploadOnCloudinary } from "../service/cloudinary.js";

export const updateDao = async (userId, virtualAssistantName, localFilePath) => {
    try {
        let imageUrl = null;

        if (localFilePath) {
            const response = await uploadOnCloudinary(localFilePath);
            imageUrl = response.secure_url;
        }

        const updateFields = { virtualAssistantName };
        if (imageUrl) {
            updateFields.virtualAssistantImage = imageUrl;
        }

        const newUser = await userModel.findByIdAndUpdate(userId, updateFields, { new: true });

        if (!newUser) {
            throw new Error('User not found');
        }

        console.log('User updated successfully:', newUser);
        return newUser;
    } catch (error) {
        console.error('Error in updateDao:', error.message);
        throw new Error('Failed to update user');
    }
};

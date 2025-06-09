import { validateToken } from '../utils/validateToken.js';
import userModel from '../models/user.models.js'

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if(!token) return res.status(401).json({message:"user is unauthorized"})
        const userId = await validateToken(token);
        if(!userId) return res.status(401).json({message:"user is unauthorized"})
        const user = await userModel.findById(userId)
        if(!user) return res.status(401).json({message:"user is unauthorized"})
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
}
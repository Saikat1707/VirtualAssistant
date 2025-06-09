import jwt from 'jsonwebtoken';

export const validateToken = async (token) => {
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        console.error("Error validating token:", error);
        return null;
    }
}
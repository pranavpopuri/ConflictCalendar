import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";

export interface AuthRequest extends Request {
    user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            res.status(401).json({ success: false, message: "No token, authorization denied" });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ success: false, message: "JWT secret not configured" });
            return;
        }

        const decoded = jwt.verify(token, jwtSecret) as { id: string };
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            res.status(401).json({ success: false, message: "Token is not valid" });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Token is not valid" });
    }
};

export const generateToken = (userId: string): string => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT secret not configured");
    }

    return jwt.sign({ id: userId }, jwtSecret, { expiresIn: "7d" });
};

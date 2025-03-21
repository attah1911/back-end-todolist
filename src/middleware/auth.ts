import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export const authorize = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || !SECRET_KEY) {
    return res.status(!SECRET_KEY ? 500 : 401).json({
      success: false,
      message: !SECRET_KEY ? "Internal Server Error" : "Unauthorized",
    });
  }

  try {
    req.user = jwt.verify(token, SECRET_KEY) as { id: number; email: string };
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

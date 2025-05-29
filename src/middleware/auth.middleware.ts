import { error } from 'console';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticated = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ 
      status: "error",
      code: 401,
      message: 'You are not authorized',
    error: [
        'No token provided. Please provide a valid JWT token in the Authorization header.'     ] });
    return;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ 
      status: "error",
      code: 401,
      message: 'Token is expired or inavalid' });
  }
};

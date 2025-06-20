import jwt from 'jsonwebtoken';
import { User } from '../modals/user';

export interface VerifyPayload {
  userId: number;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 
const JWT_RESET_SECRET= process.env.JWT_RESET_SECRET|| 'garah02032022'

export function generateJWT(user: User): string {
    return jwt.sign(
      { 
        id: user.id,
        email: user.email, 
        name: user.username , 
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

export const generateResetToken = (email: string): string => {
  return jwt.sign({ email }, JWT_RESET_SECRET!, { expiresIn: '15m' });
};

export function generateVerifyToken(payload: VerifyPayload): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET in environment');
  }
  return jwt.sign(
    { userId: payload.userId, email: payload.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyVerifyToken(token: string): VerifyPayload {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET in environment');
  }
  return jwt.verify(token, process.env.JWT_SECRET) as VerifyPayload;
}

export const generateAccountSetupToken = (payload: { userId: number, email: string }): string => {
  return jwt.sign(payload, process.env.JWT_SETUP_SECRET!, {
    expiresIn: '7d',
  });
};
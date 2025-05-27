import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import { sendVerificationOTP, sendResetOTP } from '../utils/otpUtils';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create(username, email, hashedPassword);

    await sendVerificationOTP(user.id, user.email);
    // ✅ FIXED this line

    res.status(201).json({ message: 'User registered. Verification OTP sent to email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyAccount = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ FIXED this line
    if (
      user.verification_otp !== otp ||
      !user.otp_expiry ||
      new Date(user.otp_expiry) < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await UserModel.verifyUser(user.id);
    res.json({ message: 'Account verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Account not verified' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await sendResetOTP(user.id, user.email);

    res.json({ message: 'Reset OTP sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ FIXED this line
    if (
      user.reset_otp !== otp ||
      !user.reset_otp_expiry ||
      new Date(user.reset_otp_expiry) < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(user.id, hashedPassword);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const user = await UserModel.findProfileById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

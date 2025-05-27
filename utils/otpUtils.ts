import nodemailer from 'nodemailer';
import UserModel from '../models/user.model';

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

export const sendVerificationOTP = async (userId: number, email: string): Promise<void> => {
  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await UserModel.setVerificationOTP(userId, otp, expiry);

  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: '"Your App" <noreply@yourapp.com>',
    to: email,
    subject: 'Verify Your Email',
    text: `Your verification OTP is: ${otp}`,
    html: `<p>Your verification OTP is: <b>${otp}</b></p>`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Verification email sent:', info.messageId);

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log('📩 Verification Preview URL:', previewUrl);
  }
};

export const sendResetOTP = async (userId: number, email: string): Promise<void> => {
  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await UserModel.setResetOTP(userId, otp, expiry);

  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: '"Your App" <noreply@yourapp.com>',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your password reset OTP is: ${otp}`,
    html: `<p>Your password reset OTP is: <b>${otp}</b></p>`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Password reset email sent:', info.messageId);

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log('🔐 Password Reset Preview URL:', previewUrl);
  }
};

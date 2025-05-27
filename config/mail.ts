// src/config/mail.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.MAIL_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export default transporter;

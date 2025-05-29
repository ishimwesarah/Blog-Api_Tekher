import { createTransporter } from "../config/mail-transport";
import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, link: string) {
  const transporter = await createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Please Confirm Your Email Address',
    html: `
      <div style="
        font-family: Arial, sans-serif; 
        background-color: #f5f5f5; 
        padding: 40px 0;
      ">
        <div style="
          max-width: 600px; 
          margin: auto; 
          background: #fff; 
          border-radius: 8px; 
          box-shadow: 0 0 10px rgba(0,0,0,0.1); 
          padding: 30px;
        ">
          <h2 style="color: #4CAF50; text-align: center;">Welcome to Our Platform!</h2>
          
          <p style="font-size: 16px; color: #333;">Hi there,</p>

          <p style="font-size: 16px; color: #333;">
            Thank you for signing up. Please confirm your email address by clicking the button below:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" target="_blank" style="
              background-color: #4CAF50;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              font-size: 16px;
              border-radius: 5px;
              display: inline-block;
            ">
              Verify Email
            </a>
          </div>

          <p style="font-size: 14px; color: #555;">
            If you didn’t create an account, you can safely ignore this message.
          </p>

          <p style="font-size: 14px; color: #999;">
            This link is valid for 24 hours.
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

          <p style="font-size: 14px; color: #aaa; text-align: center;">
            &copy; ${new Date().getFullYear()} Sarah App. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });
}

export const sendResetPasswordEmail = async (email: string, resetLink: string) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="
        font-family: Arial, sans-serif; 
        background-color: #f5f5f5; 
        padding: 40px 0;
      ">
        <div style="
          max-width: 600px; 
          margin: auto; 
          background: #fff; 
          border-radius: 8px; 
          box-shadow: 0 0 10px rgba(0,0,0,0.1); 
          padding: 30px;
        ">
          <h2 style="color: #ff6f61; text-align: center;">Reset Your Password</h2>

          <p style="font-size: 16px; color: #333;">Hello,</p>

          <p style="font-size: 16px; color: #333;">
            We received a request to reset your password. If this was you, click the button below to proceed:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" target="_blank" style="
              background-color: #ff6f61;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              font-size: 16px;
              border-radius: 5px;
              display: inline-block;
            ">
              Reset Password
            </a>
          </div>

          <p style="font-size: 14px; color: #555;">
            If you did not request a password reset, no action is needed. You can safely ignore this message.
          </p>

          <p style="font-size: 14px; color: #999;">
            This link will expire in 15 minutes for security purposes.
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

          <p style="font-size: 14px; color: #aaa; text-align: center;">
            &copy; ${new Date().getFullYear()} Sarah App. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send reset password email. Please try again later.');
  }
};


export async function sendEmailVerifiedConfirmation(email: string) {
  const transporter = await createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verified Successfully',
    html: `
      <div style="
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        padding: 40px 0;
      ">
        <div style="
          max-width: 600px;
          margin: auto;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          padding: 30px;
        ">
          <h2 style="color: #4CAF50; text-align: center;">Email Verified</h2>

          <p style="font-size: 16px; color: #333;">
            Hello,
          </p>

          <p style="font-size: 16px; color: #333;">
            Your email has been successfully verified. You can now access all features and continue using our services without any limitations.
          </p>

          <p style="font-size: 16px; color: #333;">
            If you have any questions or need assistance, feel free to reach out to our support team.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" target="_blank" style="
              background-color: #4CAF50;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              font-size: 16px;
              border-radius: 5px;
              display: inline-block;
            ">
              Go to Dashboard
            </a>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

          <p style="font-size: 14px; color: #aaa; text-align: center;">
            &copy; ${new Date().getFullYear()} Sarah App. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });
}
export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  await transporter.sendMail({
    from: `"No Reply" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};



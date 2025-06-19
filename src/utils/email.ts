import nodemailer from 'nodemailer';

// This is our central, reusable function to create the Gmail transporter.
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your full gmail address from .env
      pass: process.env.EMAIL_PASS, // Your 16-character Google App Password
    },
  });
};

// --- This is your existing function for public signup verification ---
export async function sendVerificationEmail(email: string, link: string) {
  const transporter = createGmailTransporter();

  await transporter.sendMail({
    from: `"Recipe Book App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Please Confirm Your Email Address',
    // --- ✅ Using a proper <a> tag for the link ---
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Welcome to Recipe Book!</h2>
        <p>Thank you for signing up. Please click the button below to verify your email address.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${link}" target="_blank" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Verify Email Address
          </a>
        </div>
        <p>This link is valid for 24 hours.</p>
      </div>
    `,
  });
}

// --- This is your function for password resets ---
export const sendResetPasswordEmail = async (email: string, resetLink: string) => {
  const transporter = createGmailTransporter();

  await transporter.sendMail({
    from: `"Recipe Book App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password',
    // --- ✅ Using a proper <a> tag for the link ---
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <h2 style="color: #f44336;">Password Reset Request</h2>
        <p>We received a request to reset your password. If this was you, click the button below to proceed.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetLink}" target="_blank" style="background-color: #f44336; color: white; padding: 14px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Reset Your Password
          </a>
        </div>
        <p>This link will expire in 15 minutes.</p>
      </div>
    `,
  });
};

// --- This is the new function for invited users ---
export const sendAccountSetupEmail = async (to: string, setupLink: string) => {
  const transporter = createGmailTransporter();

  await transporter.sendMail({
    from: `"Recipe Book App" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Complete Your Account Setup for Recipe Book',
    // --- ✅ Using a proper <a> tag for the link ---
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <h1>Welcome to Recipe Book!</h1>
        <p>An administrator has created an account for you.</p>
        <p>To complete your setup and create your password, please click the link below:</p>
        <div style="margin: 30px 0; text-align: center;">
            <a href="${setupLink}" target="_blank" style="background-color: #2196F3; color: white; padding: 14px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Set Up My Account
            </a>
        </div>
        <p>This link will expire in 7 days.</p>
      </div>
    `,
  });
};


// You likely have this function as well, it can be removed if unused or kept for other purposes.


export async function sendEmailVerifiedConfirmation(email: string) {
  const transporter = createGmailTransporter(); // Use our central function

  await transporter.sendMail({
    from: `"Recipe Book App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Email Verified Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verified!</h2>
        <p>Your email has been successfully verified. Welcome aboard!</p>
      </div>
    `,
  });
}





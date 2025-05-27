import transporter from '../config/mail';
import pool from '../config/db';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class MailService {
  async sendEmail(options: EmailOptions) {
    try {
      const mailOptions = {
        from: process.env.MAIL_FROM,
        ...options
      };
      
      // Send email
      const info = await transporter.sendMail(mailOptions);
      
      // Log to database
      await pool.query(
        'INSERT INTO sent_emails (recipient, subject, message_id) VALUES ($1, $2, $3)',
        [options.to, options.subject, info.messageId]
      );
      
      return info;
    } catch (error) {
      throw error;
    }
  }

  async getSentEmails() {
    const { rows } = await pool.query('SELECT * FROM sent_emails');
    return rows;
  }
}

export default new MailService();
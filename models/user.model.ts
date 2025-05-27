import pool from '../config/db';

interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  is_verified: boolean;
  verification_otp: string | null;
  otp_expiry: Date | null;
  reset_otp: string | null;
  reset_otp_expiry: Date | null;
  role: string;
}

class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  }

 static async create(username: string, email: string, passwordHash: string, role: string = 'user'): Promise<User> {
  const { rows } = await pool.query(
    'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, email, passwordHash, role]
  );
  return rows[0];
}

  static async findById(id: number): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async findProfileById(id: number): Promise<Omit<User, 'password_hash'> | null> {
    const { rows } = await pool.query(
      `SELECT id, username, email, created_at FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  static async updatePassword(userId: number, newHashedPassword: string): Promise<void> {
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
      newHashedPassword,
      userId,
    ]);
  }

  static async setVerificationOTP(userId: number, otp: string, expiry: Date): Promise<void> {
    await pool.query(
      'UPDATE users SET verification_otp = $1, otp_expiry = $2 WHERE id = $3',
      [otp, expiry, userId]
    );
  }

  static async verifyUser(userId: number): Promise<void> {
    await pool.query(
      'UPDATE users SET is_verified = true, verification_otp = null, otp_expiry = null WHERE id = $1',
      [userId]
    );
  }

  static async setResetOTP(userId: number, otp: string, expiry: Date): Promise<void> {
    await pool.query(
      'UPDATE users SET reset_otp = $1, reset_otp_expiry = $2 WHERE id = $3',
      [otp, expiry, userId]
    );
  }

  static async clearResetOTP(userId: number): Promise<void> {
    await pool.query(
      'UPDATE users SET reset_otp = null, reset_otp_expiry = null WHERE id = $1',
      [userId]
    );
  }
  static async updateRole(userId: number, newRole: string): Promise<void> {
  await pool.query('UPDATE users SET role = $1 WHERE id = $2', [newRole, userId]);
}

}

export default UserModel;

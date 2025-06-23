import { AppDataSource } from "../config/database";
import { User } from "../modals/user";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { NotFoundError, UnauthorizedError } from "../utils/errors";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.password) {
      throw new Error("Password is required");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    // Create and save user
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) return null;

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) return null;

    return user;
  }

   async setupUserAccount(token: string, newPassword: string): Promise<User> {
    
    let payload: { userId: number; email: string };
    try {
      
      payload = jwt.verify(token, process.env.JWT_SETUP_SECRET!) as { userId: number; email: string };
    } catch (error) {
    
      throw new UnauthorizedError("This account setup link is invalid or has expired.");
    }

   
    const user = await this.userRepository.findOneBy({ id: payload.userId });

    
    if (!user) {
      throw new NotFoundError("The user associated with this link could not be found.");
    }
    if (user.isVerified || user.password) {
    
      throw new UnauthorizedError("This account has already been set up.");
    }
    if (user.accountSetupToken !== token) {
      
      throw new UnauthorizedError("This setup link has already been used or is outdated.");
    }

    // 4. Hash the new password provided by the user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 5. Update the user's record
    user.password = hashedPassword;
    user.isVerified = true;
    user.accountSetupToken = undefined; 

    
    return this.userRepository.save(user);
  }

}
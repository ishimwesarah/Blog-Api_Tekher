import { AppDataSource } from '../config/database';
import { User, UserRole } from '../modals/user';
import bcrypt from "bcrypt";
import { ConflictError, NotFoundError } from '../utils/errors';
import { generateAccountSetupToken } from '../utils/jwt';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async findAll(): Promise<User[]> {
      return this.userRepository
      .createQueryBuilder("user")
      .loadRelationCountAndMap("user.postCount", "user.posts")
      .orderBy("user.createdAt", "DESC")
      .getMany();
  
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findByName(username: string): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.username) LIKE LOWER(:username)', { username: `%${username}%` })
      .getMany();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  // In src/services/user.service.ts
async update(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundError("User not found");
    this.userRepository.merge(user, updateData);
    return this.userRepository.save(user);
}

  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
    async createInvitation(username: string, email: string, role: UserRole): Promise<{ newUser: User, setupToken: string }> {
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictError("A user with this email already exists.");
    }
    
    // Create the user object. Note that `password` is not provided.
    let newUser = this.userRepository.create({ username, email, role, isVerified: false });
    // Save it first to get an ID
    newUser = await this.userRepository.save(newUser);
    
    // Generate a setup token that includes the new user's ID
    const setupToken = generateAccountSetupToken({ userId: newUser.id, email: newUser.email });
    newUser.accountSetupToken = setupToken; // Store the token
    
    // Save the user again with the token
    await this.userRepository.save(newUser);
    
    return { newUser, setupToken };
  }
}

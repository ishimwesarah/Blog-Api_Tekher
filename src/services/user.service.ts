import { AppDataSource } from '../config/database';
import { User } from '../modals/user';
import bcrypt from "bcrypt";
import { NotFoundError } from '../utils/errors';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
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
}
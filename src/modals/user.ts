import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from './blog';

export type UserRole = 'user' | 'admin'| 'super_admin';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  username!: string;

  @Column({ length: 100, nullable: true, unique: true })
  email!: string;

  @Column({ type: 'enum', enum: ['user', 'admin', 'super_admin'], default: 'user' })
  role!: UserRole;

  @Column({ length: 255 })
  password!: string;
  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ default: false })    
  isVerified!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
 
@OneToMany(() => Post, post => post.author)
posts: Post[] | undefined;


}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user"; // ✅ Make sure path is correct

interface Author extends User {
  id: number;
  username: string;
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({
    type: "jsonb",
    nullable: true, 
  })
  content?: object[];
   @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => User, (user) => user.posts)
  author!: Author;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
  static author: any;
}
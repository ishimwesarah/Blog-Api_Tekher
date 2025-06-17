import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user"; // Ensure this path is correct

// The `Author` interface is fine for type-hinting, but we will use `User` in the class
// for simplicity and consistency with the decorator.

@Entity("posts") // It's good practice to explicitly name your table
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


  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "SET NULL", 
    eager: true, 
  })
  @JoinColumn({ name: "authorId" }) 
  author!: User; 

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // The duplicate `static author: any;` line has been removed.
}
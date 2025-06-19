import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import { User } from "./user";
import { Like } from "./Like";
import { Comment } from "./Comment";

@Entity("recipes")
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column({ length: 100 })
  cookTime!: string; 

  @Column()
  imageUrl!: string; 

  @Column("simple-array")
  ingredients!: string[];

  @Column("simple-array")
  instructions!: string[];

  
  @ManyToOne(() => User, (user) => user.posts) 
  author!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
  @OneToMany(() => Like, like => like.recipe, { eager: true })
likes!: Like[];

@OneToMany(() => Comment, comment => comment.recipe, { eager: true })
comments!: Comment[];
}
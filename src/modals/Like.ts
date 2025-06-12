import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./user";
import { Recipe } from "./Recipe";

@Entity("likes")
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Recipe)
  recipe!: Recipe;

  @CreateDateColumn()
  created_at!: Date;
}
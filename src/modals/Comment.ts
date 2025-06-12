import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user";
import { Recipe } from "./Recipe";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  text!: string;

  @ManyToOne(() => User)
  author!: User;

  @ManyToOne(() => Recipe)
  recipe!: Recipe;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
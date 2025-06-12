import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./user"; // Ensure path is correct

@Entity("shopping_list_items")
export class ShoppingListItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  item!: string; // e.g., "Flour"

  @Column({ default: false })
  isChecked!: boolean;

  // This creates the relationship: Many shopping list items can belong to one user.
  @ManyToOne(() => User)
  user!: User;

  @CreateDateColumn()
  created_at!: Date;
}
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modals/user';
import { Post } from '../modals/blog';
import { Recipe } from "../modals/Recipe";  
import { Like } from "../modals/Like";
import { Comment } from "../modals/Comment";
import { ShoppingListItem } from "../modals/ShoppingListItem";

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '02032022',
  database: process.env.DB_DATABASE || 'THE-OTHER',
  synchronize: process.env.NODE_ENV !== 'production',
  entities: [User, Post, Recipe, Like, Comment, ShoppingListItem],  
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Error during database initialization', error);
    throw error;
  }
};


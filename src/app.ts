import 'reflect-metadata';
import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { initializeDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import router from './routes';

dotenv.config();


const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '8080');
app.use(cors());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

//Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
 
app.use('/', router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Error handling middleware
app.use(errorHandler);

// Start the server
const startServer = async () => {
    try {
      // Initialize db connection
      await initializeDatabase();
      
      // Start Express server
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
      });
      app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
});
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  };
  
  // Run the server
  startServer();


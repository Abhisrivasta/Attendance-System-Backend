import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import { verifySupabaseToken } from './middlewares/auth.middleware';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',verifySupabaseToken ,authRoutes);

export default app;

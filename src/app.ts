import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import universityRoutes from './routes/university.routes';
import collegeRoutes from './routes/college.routes';
import courseRoutes from "./routes/course.route";
import batchRoutes from "./routes/batch.routes";
import { verifySupabaseToken } from './middlewares/auth.middleware';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',verifySupabaseToken ,authRoutes);
app.use('/api/university',universityRoutes);
app.use('/api/college',collegeRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/batches", batchRoutes);



export default app;

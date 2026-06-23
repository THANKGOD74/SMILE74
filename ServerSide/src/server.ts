import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes'; 
import { protect } from './middleWare/auth';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

//auth routes FIRST (public - no protection needed)
app.use('/api/auth', authRoutes);

// task routes (protected)
app.use('/api/tasks', protect, taskRoutes);

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
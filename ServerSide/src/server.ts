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

// Public auth routes (no protection)
app.use('/api/auth', authRoutes);                  

// Protected task routes
app.use('/api/tasks', protect, taskRoutes);        

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// import dns from 'dns';
// dns.setServers(['8.8.8.8', '8.8.4.4']);


// import express from 'express'
// import cors from 'cors'
// import dotenv from 'dotenv'
// import connectDB from './config/db'
// import taskRoute from './routes/taskRoutes'
// import { protect } from './middleWare/auth';


// dotenv.config();
// connectDB();


// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/tasks', protect, taskRoute);


// const PORT = process.env.PORT || 4040;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

const app = express();

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:3000', // URL của frontend
    credentials: true, // Cho phép gửi cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);

// Initialize database connection
AppDataSource.initialize()
    .then(() => {
        console.log('Database đã kết nối thành công');
    })
    .catch((error) => {
        console.error('Lỗi kết nối database:', error);
    });

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
}); 

export { AppDataSource };

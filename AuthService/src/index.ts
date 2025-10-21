import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth';

// tải cấu hình từ file .env
dotenv.config();

const app = express();
app.set('trust proxy', 'loopback');

// Sử dụng helmet để bảo mật HTTP headers
app.use(helmet());

// Cấu hình CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8000'], // Allow both frontend and Kong Gateway
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// middleware bảo mật
app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);

// Kết nối database
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

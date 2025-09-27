import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import thanhToanRoutes from "./routes/ThanhToanRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Cấu hình CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8000'], // Allow both frontend and Kong Gateway
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/payments', thanhToanRoutes);

// Kết nối database và khởi chạy server
AppDataSource.initialize()
    .then(() => {
        console.log("Kết nối database thành công");
        const PORT = process.env.PORT || 3004;
        app.listen(PORT, () => {
            console.log(`ThanhToanService đang chạy trên cổng ${PORT}`);
        });
    })
    .catch((error: Error) => console.log("Lỗi kết nối database: ", error));
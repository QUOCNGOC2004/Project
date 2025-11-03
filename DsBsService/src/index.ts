import "reflect-metadata";
import express from "express";
// import cors from "cors";
import { AppDataSource } from "./config/database";
import doctorRoutes from "./routes/doctorRoutes";
import scheduleRoutes from "./routes/scheduleRoutes";
import dotenv from "dotenv";
import helmet from "helmet";

dotenv.config();

const app = express();
app.set('trust proxy', 'loopback');

app.use(helmet()); // Bảo mật HTTP headers

// Cấu hình CORS
// app.use(cors({
//     origin: ['http://localhost:3000', 'http://localhost:8000'], // Allow both frontend and Kong Gateway
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(express.json());

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/schedules', scheduleRoutes);

// Kết nối database và khởi chạy server
AppDataSource.initialize()
    .then(() => {
        console.log("Kết nối database thành công");
        const PORT = process.env.PORT || 3002;
        app.listen(PORT, () => {
            console.log(`DsBsService đang chạy trên cổng ${PORT}`);
        });
    })
    .catch((error: Error) => console.log("Lỗi kết nối database: ", error)); 
import "reflect-metadata";
import express from "express";
// import cors from "cors";
import { AppDataSource } from "./config/database";
import lichHenRoutes from "./routes/LichHenRoutes";
import dotenv from "dotenv";
import helmet from "helmet";

dotenv.config();

const app = express();
app.set('trust proxy', 'loopback');

app.use(helmet()); // Bảo mật HTTP headers

// // Cấu hình CORS
// app.use(cors({
//     origin: ['http://localhost:3000', 'http://localhost:8000'], 
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(express.json()); // Phân tích JSON

// Routes
app.use('/api/appointments', lichHenRoutes);

// Kết nối database và khởi chạy server
AppDataSource.initialize()
    .then(() => {
        console.log("Kết nối database thành công");
        const PORT = process.env.PORT || 3003;
        app.listen(PORT, () => {
            console.log(`DatLichService đang chạy trên cổng ${PORT}`);
        });
    })
    .catch((error: Error) => console.log("Lỗi kết nối database: ", error)); 
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import doctorRoutes from "./routes/doctorRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:3000', // URL của frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/doctors', doctorRoutes);

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
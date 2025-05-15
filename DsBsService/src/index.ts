import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import doctorRoutes from "./routes/doctorRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/doctors', doctorRoutes);

// Initialize database connection and start server
AppDataSource.initialize()
    .then(() => {
        console.log("Database connection established");
        const PORT = process.env.PORT || 3002;
        app.listen(PORT, () => {
            console.log(`DsBsService is running on port ${PORT}`);
        });
    })
    .catch((error: Error) => console.log("TypeORM connection error: ", error)); 
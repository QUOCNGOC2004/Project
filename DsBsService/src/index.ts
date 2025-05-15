import "reflect-metadata";
import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { Doctor } from "./entity/Doctor";
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

// Database connection
export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "your_password",
    database: process.env.DB_NAME || "webkhambenh",
    synchronize: false,
    logging: true,
    entities: [Doctor],
    subscribers: [],
    migrations: [],
});

// API Routes
app.get("/api/doctors", async (_req, res) => {
    try {
        const doctorRepository = AppDataSource.getRepository(Doctor);
        const doctors = await doctorRepository.find();
        console.log('Fetched doctors:', doctors); // Add logging
        res.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

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
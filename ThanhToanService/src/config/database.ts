import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { UserBankAccount } from "../entity/UserBankAccount";
import { Invoice } from "../entity/Invoice";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "your_password",
    database: process.env.DB_NAME || "webkhambenh",
    synchronize: false, 
    logging: true,
    entities: [UserBankAccount, Invoice],
    subscribers: [],
    migrations: [],
});

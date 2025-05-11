import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../index";
import { User } from "../entity/User";
import { validate } from "class-validator";

export const register = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, email, password } = req.body;
        console.log('Register attempt:', { username, email });

        // Check if user already exists
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({
            where: [{ email }, { username }]
        });

        if (existingUser) {
            console.log('User already exists:', existingUser);
            return res.status(400).json({
                error: "User with this email or username already exists"
            });
        }

        // Create new user
        const user = new User();
        user.username = username;
        user.email = email;
        user.password = await bcrypt.hash(password, 10);

        // Validate user
        const errors = await validate(user);
        if (errors.length > 0) {
            console.log('Validation errors:', errors);
            return res.status(400).json({ errors });
        }

        // Save user
        await userRepository.save(user);
        console.log('User registered successfully:', { id: user.id, username: user.username, email: user.email });

        // Generate token
        const payload = { id: user.id };
        const secret = process.env.JWT_SECRET || "secret";
        const options = { expiresIn: "24h" as const };
        const token = jwt.sign(payload, secret, options);

        return res.status(201).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: "Server error" });
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;

        // Find user
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate token
        const payload = { id: user.id };
        const secret = process.env.JWT_SECRET || "secret";
        const options = { expiresIn: "24h" as const };
        const token = jwt.sign(payload, secret, options);

        return res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            token
        });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Please authenticate" });
        }

        return res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
}; 
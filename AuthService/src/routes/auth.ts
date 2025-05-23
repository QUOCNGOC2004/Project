import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);

export default router; 
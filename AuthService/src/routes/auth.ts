import { Router } from "express";
import { register, login, getProfile, updateProfile , adminLogin } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = Router();
//routes ko đc bảo vệ
router.post("/admin/login", adminLogin);
router.post("/register", register);
router.post("/login", login);
//routes đc bảo vệ
router.get("/profile", auth(['user']), getProfile);
router.put("/profile", auth(['user']), updateProfile);


export default router; 
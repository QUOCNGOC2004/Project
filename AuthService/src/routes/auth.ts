import { Router } from "express";
import { register, login, getProfile, updateProfile , adminLogin , getUserProfileByIdForAdmin } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = Router();
//routes ko đc bảo vệ
router.post("/admin/login", adminLogin);
router.post("/register", register);
router.post("/login", login);
//routes đc bảo vệ
router.get("/profile", auth(['user']), getProfile);
router.put("/profile", auth(['user']), updateProfile);

router.get("/user/:id", auth(['admin']), getUserProfileByIdForAdmin);


export default router; 
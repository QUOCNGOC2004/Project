import { Router } from "express";
import { register, login, getProfile, updateProfile, adminLogin, getUserProfileByIdForAdmin, getAllUsers,deleteUser } from "../controllers/authController";
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
router.get("/user", auth(['admin']), getAllUsers);
router.delete("/user/:id", auth(['admin']), deleteUser);


export default router; 
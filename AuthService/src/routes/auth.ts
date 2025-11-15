import { Router } from "express";
import { register, login, adminLogin } from "../controllers/authController";
import { getProfile, updateProfile } from "../controllers/authControllerUser";
import { getUserProfileByIdForAdmin, getAllUsers, deleteUser } from "../controllers/authControllerAdmin";
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
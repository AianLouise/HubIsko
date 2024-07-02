import express from "express";
import { test, updateUser, deleteUser, forgotPassword, resetPassword, getUserDetails } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/", test);
router.post("/update/:id", verifyToken, updateUser)
router.delete("/delete/:id", verifyToken, deleteUser)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get("/details", verifyToken, getUserDetails);

export default router;
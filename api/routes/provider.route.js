import express from "express";
import { signupAsProvider, test } from '../controllers/provider.controller.js';

const router = express.Router();

router.get("/test", test);
router.post("/signupAsProvider", signupAsProvider);

export default router;
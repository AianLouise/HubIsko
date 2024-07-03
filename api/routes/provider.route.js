import express from "express";
import { signupAsProvider, test } from '../controllers/provider.controller.js';

const router = express.Router();

router.get("/", test);
router.post("/signup-as-provider", signupAsProvider);

export default router;
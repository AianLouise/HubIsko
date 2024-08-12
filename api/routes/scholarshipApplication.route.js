import express from "express";
import { createScholarshipApplication, test } from '../controllers/scholarshipApplication.controller.js';

const router = express.Router();

router.get("/test", test);
router.post("/create-application", createScholarshipApplication);

export default router;
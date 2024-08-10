import express from "express";
import { createScholarshipProgram, getScholarshipProgramsByProviderId, test } from '../controllers/scholarshipProgram.controller.js';

const router = express.Router();

router.get("/test", test);
router.post("/create-scholarship", createScholarshipProgram);
router.get("/provider/:id", getScholarshipProgramsByProviderId);

export default router;
import express from "express";
import { getValidationByProgram, postValidation, test } from '../controllers/validation.controller.js';

const router = express.Router();

router.get("/test", test);
router.post("/validations", postValidation);
router.get('/program/:id', getValidationByProgram);

export default router;
import express from "express";
import { getValidationByProgram, createValidation, test, postValidation, updateValidation, deleteValidation, completeValidation, getValidationsByProgram, getValidationsByProvider, approveValidationResult, rejectValidationResult } from '../controllers/validation.controller.js';

const router = express.Router();

router.get("/test", test);
router.post("/validations", createValidation);
router.get('/program/:id', getValidationByProgram);
router.post('/:id/post', postValidation);
router.put('/validations/:id', updateValidation);
router.put('/delete/:id', deleteValidation);
router.put('/:id/done', completeValidation);
router.get('/program/:programId', getValidationsByProgram);
router.get('/provider/:providerId/validations', getValidationsByProvider);

// Route to approve validation result
router.put('/:validationId/result/:resultId/approve', approveValidationResult);

// Route to reject validation result
router.put('/:validationId/result/:resultId/reject', rejectValidationResult);

export default router;
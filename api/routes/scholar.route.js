import express from 'express';
import { test, getApplicantDetails } from '../controllers/scholar.controller.js';

const router = express.Router();

router.post('/test', test);
router.get('/applicantDetails/:id', getApplicantDetails); // New route

export default router;
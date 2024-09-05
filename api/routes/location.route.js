// routes/locationRoutes.js
import express from 'express';
import { saveLocation, getLocation } from '../controllers/location.controller.js';

const router = express.Router();

// Save location
router.post('/save-location', saveLocation);

// Get location by userId
router.get('/get-location/:userId', getLocation);

export default router;
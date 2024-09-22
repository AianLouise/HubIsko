import express from 'express';
import {
    test,
    getUserDetailsById
} from '../controllers/providerAccount.controller.js';

const router = express.Router();

router.post('/test', test);

// Add a new route to get user details by ID
router.get('/user/:id', getUserDetailsById);

export default router;
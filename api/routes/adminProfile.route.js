import express from 'express';
import {
    getProviderDetails,
    test
} from '../controllers/adminProfile.controller.js';

const router = express.Router();

router.post('/test', test);
router.get('/provider/:id', getProviderDetails);

export default router;
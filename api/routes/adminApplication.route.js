import express from 'express';
import {
    getPendingVerificationUsers,
  test
} from '../controllers/adminApplication.controller.js';

const router = express.Router();

router.post('/test', test);
router.get('/users/pending-verification', getPendingVerificationUsers);

export default router;
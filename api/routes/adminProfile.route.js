import express from 'express';
import {
  test
} from '../controllers/adminProfile.controller.js';

const router = express.Router();

router.post('/test', test);

export default router;
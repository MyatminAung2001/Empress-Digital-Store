import express from 'express';

import { login, signup } from '../controllers/auth.js';

const router = express.Router();

// Signup
router.post('/signup', signup);

// Login
router.post('/login', login);
 
export default router; 
import express from 'express';
import { signup, login } from '../controllers/auth.controllers.js';
import { authLimiter } from '../config/security.config.js';

const router = express.Router();

// Apply rate limiter to all authentication routes
router.use(authLimiter);

// Signup route
router.post('/signup', signup);

// Login routes (both aliases)
router.post(['/login', '/signin'], login);

export default router;
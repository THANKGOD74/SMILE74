import { Router } from 'express';
import { register, login, updateProfile, forgotPassword, resetPassword, verifyEmail } from '../controllers/authControllers';
import { protect } from '../middleWare/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);  

// Protected routes
router.put('/profile', protect, updateProfile);

export default router;
import { Router } from 'express';
import { register, login, updateProfile, forgotPassword, resetPassword, verifyEmail } from '../controllers/authControllers';
import { protect } from '../middleWare/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);   // 👈 NEW

// Protected routes
router.put('/profile', protect, updateProfile);

export default router;



// import { Router } from 'express';
// import { register, login, updateProfile, forgotPassword, resetPassword } from '../controllers/authControllers';
// import { protect } from '../middleWare/auth';

// const router = Router();

// // Public routes
// router.post('/register', register);
// router.post('/login', login);
// router.post('/forgot-password', forgotPassword);      // 👈 NEW
// router.post('/reset-password/:token', resetPassword); // 👈 NEW

// // Protected routes
// router.put('/profile', protect, updateProfile);

// export default router;



// import { Router } from 'express';
// import { register, login, updateProfile } from '../controllers/authControllers';
// import { protect } from '../middleWare/auth';

// const router = Router();
// router.post('/register', register);
// router.post('/login', login);
// router.put('/profile', protect, updateProfile);

// export default router;
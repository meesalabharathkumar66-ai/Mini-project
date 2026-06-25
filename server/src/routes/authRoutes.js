import express from 'express';
import passport from 'passport';
import { googleAuthCallback, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();
// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleAuthCallback);
// General auth
router.get('/me', protect, getMe);
router.post('/logout', logout);
export default router;
//# sourceMappingURL=authRoutes.js.map
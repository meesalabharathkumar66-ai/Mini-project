import express from 'express';
import passport from 'passport';
import { googleAuthCallback, getMe, logout, login, register, setupVault, unlockVault, renameAccount } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleAuthCallback
);

// General auth
router.post('/register', register);
router.post('/login', login);
router.post('/vault/setup', protect, setupVault);
router.post('/vault/unlock', protect, unlockVault);
router.patch('/rename-account', protect, renameAccount);
router.get('/me', protect, getMe);
router.post('/logout', logout);

export default router;

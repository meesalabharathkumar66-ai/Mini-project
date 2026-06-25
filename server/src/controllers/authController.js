import {} from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};
export const googleAuthCallback = (req, res) => {
    if (!req.user) {
        return res.status(401).redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
    const user = req.user;
    const token = generateToken(user._id);
    // Set token in cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
};
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
export const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
//# sourceMappingURL=authController.js.map
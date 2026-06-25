import express, {} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import path from 'path';
import connectDB from './config/db.js';
// Load env vars
dotenv.config();
// Connect to database
connectDB();
const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(helmet({
    contentSecurityPolicy: false, // For development and simple streaming
}));
app.use(morgan('dev'));
// Passport session setup
app.use(passport.initialize());
// Static folder for uploads (for development)
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
// Routes placeholder
app.get('/', (req, res) => {
    res.send('S.A.M API is running...');
});
import authRoutes from './routes/authRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import './config/passport.js';
// ... (previous middlewares)
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
// app.use('/api/admin', adminRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
//# sourceMappingURL=index.js.map
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import providerRoutes from './routes/provider.route.js';
import forumRoutes from './routes/forum.route.js';
import scholarshipProgramRoutes from './routes/scholarshipProgram.route.js';
import scholarshipApplicationRoutes from './routes/scholarshipApplication.route.js';
import profileRoutes from './routes/profile.route.js';
import adminRoutes from './routes/admin.route.js';
import notificationRoutes from './routes/notification.route.js';
import ActivityLogRoutes from './routes/activityLog.route.js';
import ScholarshipActivityRoutes from './routes/scholarshipActivityLog.route.js';
import ValidationRoutes from './routes/validation.route.js';
import AnnouncementRoutes from './routes/announcement.route.js';
import ScholarRoutes from './routes/scholar.route.js';
import AdminApp from './routes/adminApplication.route.js';
import AdminForums from './routes/adminForums.route.js';
import AdminProfile from './routes/adminProfile.route.js';
import ProviderAccountRoutes from './routes/providerAccount.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import User from './models/user.model.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Create default admin account if it doesn't exist
    await User.createDefaultAdmin();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });


const __dirname = path.resolve();

// API Routes
app.use('/api/user', userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/provider", providerRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/scholarshipProgram', scholarshipProgramRoutes);
app.use('/api/scholarshipApplication', scholarshipApplicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/activity', ActivityLogRoutes);
app.use('/api/scholarshipActivity', ScholarshipActivityRoutes);
app.use('/api/validation', ValidationRoutes);
app.use('/api/announcement', AnnouncementRoutes);
app.use('/api/scholar', ScholarRoutes);
app.use('/api/adminApp', AdminApp);
app.use('/api/adminForums', AdminForums);
app.use('/api/adminProfile', AdminProfile);
app.use('/api/providerAccount', ProviderAccountRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Catch-all route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

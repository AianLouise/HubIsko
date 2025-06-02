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

const __dirname = path.resolve();

const app = express();

// Enable CORS for frontend origin and allow credentials
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://hubisko.vercel.app'
    ],
    credentials: true
}));

// Connect to MongoDB (ensure connection is not duplicated in Vercel cold starts)
let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected');
}
connectDB().catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

app.use(express.json());
app.use(cookieParser());

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

// Serve static files (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'dist')));
  
  // Catch-all route to serve index.html (only in development)
  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
} else {
  // In production, handle non-API routes
  app.get('/', (req, res) => {
    res.json({ 
      message: 'HubIsko API is running!', 
      version: '1.0.0',
      endpoints: [
        '/api/auth',
        '/api/user',
        '/api/provider',
        '/api/forums',
        '/api/scholarshipProgram',
        '/api/scholarshipApplication',
        '/api/admin',
        '/api/profile',
        '/api/notification'
      ]
    });
  });
}

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

// Only start the server in development mode
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the app for Vercel
export default app;

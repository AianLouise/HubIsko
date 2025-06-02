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

// CORS configuration to handle credentials
const corsOptions = {  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // Local backend
      'http://localhost:4173', // Vite preview
      'https://hub-isko.vercel.app', // Production frontend
      'https://hubisko.vercel.app', // Alternative production URL
      'https://hubisko-api.vercel.app', // API domain
    ];

    // Add any additional origins from environment variable
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origin not allowed by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-access-token', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['set-cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json());
app.use(cookieParser());

// Improved MongoDB connection for serverless
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const options = {
      bufferCommands: false,
      // Remove deprecated options
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    const connection = await mongoose.connect(process.env.MONGODB_URI, options);

    // Wait for the connection to be ready
    await new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once('connected', resolve);
        mongoose.connection.once('error', reject);
      }
    });

    isConnected = true;
    console.log('Connected to MongoDB');

    // Create default admin account after connection is fully established
    await User.createDefaultAdmin();
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
};

// Middleware to ensure database connection
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      statusCode: 500,
    });
  }
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

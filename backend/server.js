const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const fileRoutes = require('./routes/fileRoutes');
const miscRoutes = require('./routes/miscRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// DB
connectDB();

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/files', fileRoutes);
app.use('/api', miscRoutes); // donations, requests, persons

// Serve frontend build in production (if present)
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'build');

  // If the frontend `build/index.html` is missing (e.g., build step didn't run),
  // don't attempt to serve static files (that causes ENOENT errors in logs).
  const indexHtmlPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    app.use(express.static(clientBuildPath));

    // Let API and uploads continue to work; send index.html for other GET requests.
    // Use a middleware instead of a wildcard route to avoid path parsing issues on some platforms.
    app.use((req, res, next) => {
      if (req.method !== 'GET') return next();
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
      res.sendFile(indexHtmlPath);
    });
  } else {
    console.warn(`⚠️ Frontend build not found at ${indexHtmlPath}. Static serving disabled.`);
    // Provide a lightweight root health route so the service still responds to GET /
    app.get('/', (req, res) => {
      res.json({ success: false, message: 'Frontend build not found on server. Please run the build step.' });
    });
  }
} else {
  // Root route for non-production (simple health check)
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'DIS Express API running',
      version: '1.0.0'
    });
  });
}

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

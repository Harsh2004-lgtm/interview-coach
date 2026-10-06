const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const interviewRoutes = require('./routes/interviewRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend Vite dev server (usually localhost:5173)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '5mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root & Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Gemma Interview Coach API'
  });
});

// Mount Interview Routes
app.use('/api/interview', interviewRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Interview Coach Backend is running on port ${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  Gemma Status: http://localhost:${PORT}/api/interview/status`);
  console.log(`=======================================================`);
});

// ===== Service Finder Backend Server =====
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const providersRoutes = require('./routes/providersRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const walletRoutes = require('./routes/walletRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/providers', providersRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wallet', walletRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n✅ Service Finder Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);
});

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');

const app = express();
const server = http.createServer(app);

// ✅ CORS FIX (IMPORTANT)
const allowedOrigins = [
  'http://localhost:3000', // local dev
  'https://your-firebase-app.web.app' // 🔁 replace with your Firebase URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / mobile apps
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trip', tripRoutes);

// ✅ Root route (for testing)
app.get('/', (req, res) => {
  res.json({
    message: '🚗 AutoWala Backend is Running!',
    status: 'OK'
  });
});

// ✅ Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('join_trip', (tripId) => {
    socket.join(`trip_${tripId}`);
  });

  socket.on('send_message', (data) => {
    io.to(`trip_${data.tripId}`).emit('receive_message', {
      sender: data.sender,
      message: data.message,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on('driver_location', (data) => {
    io.to(`trip_${data.tripId}`).emit('location_update', {
      lat: data.lat,
      lng: data.lng
    });
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚗 Server running on port ${PORT}`);
});
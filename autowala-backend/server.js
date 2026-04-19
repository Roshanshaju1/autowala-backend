const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io setup for real-time features
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trip', tripRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🚗 AutoWala Backend is Running!', status: 'OK' });
});

// Socket.io - Real-time chat & updates
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Join a trip room
  socket.on('join_trip', (tripId) => {
    socket.join(`trip_${tripId}`);
    console.log(`User joined trip room: trip_${tripId}`);
  });

  // Send message in trip chat
  socket.on('send_message', (data) => {
    io.to(`trip_${data.tripId}`).emit('receive_message', {
      sender: data.sender,
      message: data.message,
      time: new Date().toLocaleTimeString()
    });
  });

  // Driver location update
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚗 AutoWala Backend running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready for real-time connections\n`);
});

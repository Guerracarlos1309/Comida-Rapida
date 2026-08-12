const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { initDb } = require('./db');
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/businesses');
const menuRoutes = require('./routes/menu');
const orderRoutesFactory = require('./routes/orders');

const app = express();
const server = http.createServer(app);

// Enable Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database connection
initDb();

// Socket.io connection logging
io.on('connection', (socket) => {
  console.log('⚡ Nuevo cliente conectado a WebSockets:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} se unió a la sala: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Cliente desconectado de WebSockets:', socket.id);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutesFactory(io));

// Serve static assets from client dist if built
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
      if (err) {
        res.send('API Server Fast Food Delivery is running on port 5000');
      }
    });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor backend de Comida Rápida ejecutándose en http://localhost:${PORT}`);
});

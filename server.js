// server.js

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const errorHandler = require("./middleware/errorHandler");
const { connectDb, sequelize } = require("./config/dbConnection");
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const rateLimitingMiddleware = require('./middleware/rateLimitingMiddleware')
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5001;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

const allowedOrigins = [
  'http://localhost:3000',
  "http://localhost:5173",
  '*'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.FRONTEND_URL === '*') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(rateLimitingMiddleware)


app.use('/api/contacts', require("./routes/contactRoutes"));
app.use('/api/users', require("./routes/userRoutes"));
app.use('/api/admin', require("./routes/adminRoutes"));
app.use('/api/announcements', require("./routes/announcementRoutes"));
app.use('/api/avatars', require("./routes/avatarRoutes"));
app.use('/api/chats', require("./routes/chatRoutes"));
app.use('/api/games', require("./routes/gameRoutes"));
app.use('/api/eWallet', require("./routes/userWalletRoutes"));
app.use(errorHandler);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

async function startServer() {
  try {
    // Wait for DB connection
    await connectDb();
    await sequelize.sync();

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1); // Exit the process with a non-zero status code
  }
}

startServer();

// server.js
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const { connectDb, sequelize } = require("./config/dbConnection");
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const port = process.env.PORT || 5001;

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

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50 MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
  }
});

// Endpoint to handle file upload
app.post('/api/upload-avatar', upload.single('image'), (req, res) => {
  if (req.file) {
    res.status(200).send({ message: 'File uploaded successfully', file: req.file });
  } else {
    res.status(400).send({ message: 'File upload failed' });
  }
});

app.use('/api/contacts', require("./routes/contactRoutes"));
app.use('/api/users', require("./routes/userRoutes"));
app.use('/api/admin', require("./routes/adminRoutes"));
app.use('/api/announcements', require("./routes/announcementRoutes"));
app.use('/api/avatars', require("./routes/avatarRoutes"));
app.use('/api/channels', require("./routes/chatRoutes"));
app.use(errorHandler);

async function startServer() {
  try {
    // Wait for DB connection
    await connectDb();
    await sequelize.sync();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1); // Exit the process with a non-zero status code
  }
}

startServer();

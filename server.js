const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors")


const app = express();
const port = process.env.PORT || 5000;


const allowedOrigins = [
    'http://localhost:3000', '*'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || process.env.FRONTEND_URL === '*') {
            callback(null, true);
        } else {
            callback(new CustomError('Not allowed by CORS', 403));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/api/test', (req, res) => {
    res.send('Test endpoint is working');
  });

app.use('/api/contacts', require("./routes/contactRoutes"));
app.use('/api/users', require("./routes/userRoutes"));
app.use(errorHandler);
app.use(cors())

async function startServer() {
    try {
        // Wait for DB connection
        await connectDb();

        // Start the server only after DB connection is successful
        app.listen(port, () => {
            console.log(`server running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to connect to database:', err);
        process.exit(1); // Exit the process with a non-zero status code
    }
}

startServer();
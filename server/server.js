import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config({ path: ".env.local" });

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route files
import index from './routes/index.js';

// Create Express app
const app = express();
app.use(cookieParser()); //parse incoming cookie


// CORS configuration
const corsOptions = {
  origin: 'http://localhost:8081', // Your client origin
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
};

// // Enable CORS with options
// app.use(cors(corsOptions));
app.use(cors({
  origin: true,
  credentials: true
}));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parser
app.use(express.json());

// Mount routers
app.use('/api/', index);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
  });
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
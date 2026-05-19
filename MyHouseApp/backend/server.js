import express from 'express';
import cors from 'cors';
import { checkConnection } from './config/database.js';
import routes from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.send('HouseZone Backend Server is Running!');
});

// Use routes with /api prefix
app.use('/api', routes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
// Bind to all interfaces to allow external connections
app.listen(PORT, '0.0.0.0', async() => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    await checkConnection();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});
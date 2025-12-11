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

// Use routes
app.use('/api', routes);

// Start server
app.listen(PORT, async() => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    await checkConnection();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});
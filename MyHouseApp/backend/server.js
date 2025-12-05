import express from 'express';
import cors from 'cors';
import { checkConnection } from './config/database.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('HouseZone Backend Server is Running!');
});



// Start server
app.listen(PORT, async() => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    await checkConnection();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});
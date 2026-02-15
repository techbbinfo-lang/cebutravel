import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Import models
import { 
  initializeUsersCollection, 
  User 
} from './models/User.js';
import { 
  initializeToursCollection, 
  Tour 
} from './models/Tour.js';
import { 
  initializeBookingsCollection, 
  Booking 
} from './models/Booking.js';
import { 
  initializeReviewsCollection, 
  Review 
} from './models/Review.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Import middleware
import { errorHandler } from './middleware/auth.js';

dotenv.config();

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const uri = process.env.MONGO_URI || 'mongodb+srv://bbtech:Smoker123@cebutravel.px5bx8c.mongodb.net/?appName=CebuTravel';
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoClient.connect();
    await mongoClient.db('admin').command({ ping: 1 });
    db = mongoClient.db('cebutravel');
    
    // Initialize collections
    initializeUsersCollection(db);
    initializeToursCollection(db);
    initializeBookingsCollection(db);
    initializeReviewsCollection(db);
    
    console.log('✓ MongoDB Connected');
    return true;
  } catch (err) {
    console.error('✗ MongoDB Connection Error:', err.message);
    console.log('⚠️  Server running in offline mode. Database features will be unavailable until MongoDB connects.');
    return false;
  }
}

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CebuTravel API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'CebuTravel API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tours: '/api/tours',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('UnexpectedError:', err.message);
  }
}

startServer();


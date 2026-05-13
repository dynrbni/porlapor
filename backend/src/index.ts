import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import reportRoutes from './routes/report.routes';
import agencyRoutes from './routes/agency.routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// all routes
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', reportRoutes)
app.use('/api/agencies', agencyRoutes)

//auth routes
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`PorLapor Backend is running on port ${PORT}`);
});
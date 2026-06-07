import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import reportRoutes from './routes/report.routes';
import agencyRoutes from './routes/agency.routes';
import officialNoteRoutes from './routes/officialNote.routes';
import notificationRoutes from './routes/notification.routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:8082',
    /^http:\/\/localhost:\d+$/,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// all routes
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', reportRoutes)
app.use('/api/agencies', agencyRoutes)
app.use('/api/official-notes', officialNoteRoutes)
app.use('/api/notifications', notificationRoutes)

//auth routes
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`PorLapor Backend is running on port ${PORT}`);
});
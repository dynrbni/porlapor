import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import reportRoutes from './routes/report.routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// all routes
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', reportRoutes)

//auth routes
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`PorLapor Backend is running on port ${PORT}`);
});
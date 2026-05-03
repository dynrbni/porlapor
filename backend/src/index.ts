import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// all routes
app.use('/api', userRoutes)

//auth routes
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
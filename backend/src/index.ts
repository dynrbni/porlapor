import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use('/api', userRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
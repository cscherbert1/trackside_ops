import express from 'express';
import cors from 'cors';
import { initDb } from './models';
import { errorHandler } from './middleware/errorHandler';
import layoutRoutes from './routes/layoutRoutes';
import locationRoutes from './routes/locationRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/layouts', layoutRoutes);
app.use('/api/locations', locationRoutes);
app.use(errorHandler)

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});

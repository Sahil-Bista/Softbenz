import dotenv from 'dotenv';
import { handleShutDown, startServer } from './server.js';

dotenv.config();

const PORT = 3000 || process.env.PORT;

startServer(PORT);
handleShutDown();

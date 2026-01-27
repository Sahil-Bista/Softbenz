import app from './app.js';
import { dbConn } from './config/dbConn.js';

let server;

export const startServer = async (PORT) => {
  try {
    await dbConn();
    server = app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.log('Error starting server', err);
    process.exit(1);
  }
};

export const handleShutDown = () => {
  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    if (server) server.close(() => console.log('Server closing down'));
    await mongoose.connection.close();
    console.log('Mongo connection closed');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Shutting down...');
    if (server) server.close(() => console.log('Server closing down'));
    await mongoose.connection.close();
    console.log('Mongo connection closed');
    process.exit(0);
  });
};

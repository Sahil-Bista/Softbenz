import mongoose from 'mongoose';

export const dbConn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongo Db connected');
  } catch (err) {
    console.log('Error conencting to the database', err);
    process.exit(1);
  }
};

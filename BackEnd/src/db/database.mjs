
import mongoose from 'mongoose';
import AppError from '../utilities/appError.mjs';

export const connectDb = async () => {
  try {
    console.log(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);

    if (conn) {
      console.log(`Databasen är startad på: ${conn.connection.host}`);
    }
  } catch (error) {
    throw new AppError('Kunde inte starta databasen', 500);
  }
};

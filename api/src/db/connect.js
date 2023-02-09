import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

export const dbConnection = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URL);
    console.log('DB Connected');
  } catch (err) {
    console.log(err, 'DB connection error');
  }
};

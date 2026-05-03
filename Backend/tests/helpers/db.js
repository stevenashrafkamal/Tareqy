import mongoose from 'mongoose';

export const TEST_DB = 'mongodb://localhost:27017/tareqy_test';

export const connectTestDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_DB);
  }
};

export const dropAndDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

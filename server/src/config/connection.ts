import mongoose from 'mongoose';

export const db = async (MONGODB_URI: string, dbName: string) => {
  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.MONGODB_URI, { autoIndex: false } )
  .then(() => console.log('connected to mongo'))
    .catch((err) => {
      console.error('failed to connect with mongo');
      console.error(err);
    });
};

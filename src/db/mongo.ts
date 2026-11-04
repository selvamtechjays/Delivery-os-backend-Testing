import mongoose from 'mongoose';

export async function connectMongo(uri: string): Promise<void> {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
}

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === mongoose.ConnectionStates.connected;
}

import mongoose, { type ConnectOptions } from 'mongoose';

export async function connectMongo(
  uri: string,
  options: ConnectOptions = {},
): Promise<void> {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, ...options });
}

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === mongoose.ConnectionStates.connected;
}

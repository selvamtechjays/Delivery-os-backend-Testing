import os from 'node:os';
import mongoose from 'mongoose';
import { connectMongo } from '../db/mongo';

/** URI injected by jest globalSetup (in-memory MongoDB). Never a real database. */
export function testMongoUri(): string {
  const base = process.env.TEST_MONGODB_URI;
  if (!base) {
    throw new Error(
      'TEST_MONGODB_URI is not set: integration specs must run via the jest integration project.',
    );
  }
  const worker = process.env.JEST_WORKER_ID ?? '1';
  return `${base}test_w${worker}`;
}

export async function connectTestDb(): Promise<void> {
  // The mongodb driver loads os via dynamic import(), which Jest cannot run
  // without --experimental-vm-modules; without it the handshake omits the driver
  // metadata and the server rejects it. Supplying the adapter avoids the import.
  await connectMongo(testMongoUri(), { runtimeAdapters: { os } });
}

/** Empty every collection so tests do not see each other's data. */
export async function resetDb(): Promise<void> {
  const collections = await mongoose.connection.db?.collections();
  await Promise.all((collections ?? []).map((c) => c.deleteMany({})));
}

export async function disconnectTestDb(): Promise<void> {
  await mongoose.disconnect();
}

import { MongoMemoryServer } from 'mongodb-memory-server';

// Pinned explicitly (OD-4): standalone mongod. Switch to a replica set when the
// first multi-document transaction appears. Bump the version only via a DEC.
export const MONGOD_VERSION = '7.0.14';

export default async function globalSetup(): Promise<void> {
  const server = await MongoMemoryServer.create({
    binary: { version: MONGOD_VERSION },
  });
  (globalThis as { __MONGO__?: MongoMemoryServer }).__MONGO__ = server;
  process.env.TEST_MONGODB_URI = server.getUri();
}

import { connectTestDb, disconnectTestDb, resetDb } from './db';

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

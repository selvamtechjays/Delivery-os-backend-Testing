import { createApp } from './app';
import { loadEnv } from './config/env';
import { connectMongo } from './db/mongo';

const env = loadEnv();
const app = createApp(env.corsOrigins);

app.listen(env.port, () => {
  console.info(`Backend listening on http://localhost:${env.port}`);
});

connectMongo(env.mongodbUri)
  .then(() => console.info('MongoDB connected'))
  .catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `MongoDB connection failed (${message}). Check MONGODB_URI in .env.`,
    );
  });

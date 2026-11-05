import express, { type Express } from 'express';
import type { AppDeps } from './ports';
import { healthRouter } from './routes/health';

export function createApp(
  corsOrigins: string[] = [],
  deps: AppDeps = {},
): Express {
  const app = express();
  app.locals.deps = deps;
  app.use(express.json());
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && corsOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
      );
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      );
    }
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });
  app.use('/health', healthRouter);
  return app;
}

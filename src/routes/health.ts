import { Router } from 'express';
import { isMongoConnected } from '../db/mongo';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    db: isMongoConnected() ? 'connected' : 'disconnected',
  });
});

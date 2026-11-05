import { z } from 'zod';

/** Response body of GET /health. Source of truth for backend and frontend. */
export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  db: z.enum(['connected', 'disconnected']),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

import request from 'supertest';
import { createApp } from '../app';
import { healthResponseSchema } from './health';

describe('contract: GET /health', () => {
  it('returns a body that parses against the schema', async () => {
    const res = await request(createApp()).get('/health');
    expect(healthResponseSchema.safeParse(res.body).success).toBe(true);
  });

  it('rejects an off-shape body', () => {
    expect(healthResponseSchema.safeParse({ status: 'up' }).success).toBe(
      false,
    );
    expect(
      healthResponseSchema.safeParse({ status: 'ok', db: 'unknown' }).success,
    ).toBe(false);
  });
});

import request from 'supertest';
import { createApp } from '../app';

describe('GET /health (integration, in-memory MongoDB)', () => {
  it('reports db connected once the harness has connected', async () => {
    const res = await request(createApp()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', db: 'connected' });
  });
});

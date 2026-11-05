import request from 'supertest';
import { createApp } from './app';
import { FakeMailer } from './test-support/fakes';

describe('createApp', () => {
  it('accepts injected dependencies without changing behaviour', async () => {
    const mailer = new FakeMailer();
    const app = createApp([], { mailer });
    expect(app.locals.deps).toEqual({ mailer });
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  it('echoes an allowed CORS origin and answers preflight', async () => {
    const app = createApp(['http://a.test']);
    const res = await request(app)
      .options('/health')
      .set('Origin', 'http://a.test');
    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('http://a.test');
  });

  it('does not set CORS headers for unknown origins', async () => {
    const res = await request(createApp(['http://a.test']))
      .get('/health')
      .set('Origin', 'http://evil.test');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});

import { loadEnv } from './env';

describe('loadEnv', () => {
  it('parses PORT and CORS_ORIGINS', () => {
    const env = loadEnv({
      PORT: '4000',
      MONGODB_URI: 'mongodb://db/x',
      CORS_ORIGINS: 'http://a, http://b',
    });
    expect(env).toEqual({
      port: 4000,
      mongodbUri: 'mongodb://db/x',
      corsOrigins: ['http://a', 'http://b'],
    });
  });
});

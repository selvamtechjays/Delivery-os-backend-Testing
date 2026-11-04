import 'dotenv/config';

export interface Env {
  port: number;
  mongodbUri: string;
  corsOrigins: string[];
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  return {
    port: Number(source.PORT ?? 3000),
    mongodbUri: source.MONGODB_URI ?? 'mongodb://localhost:27017/delivery-os',
    corsOrigins: (source.CORS_ORIGINS ?? '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  };
}

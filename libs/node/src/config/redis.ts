const config: {
  host: string;
  port: number;
  password: string;
  db: string;
  url: string;
} = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD || 'redis',
  db: process.env.REDIS_DB || '0',
  url: '',
};

config.url = `redis://${config.password}@${config.host}:${config.port}/${config.db}`;

console.log('config.url',config.url);

export default config;

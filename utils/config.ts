export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT? 
    parseInt(process.env.REDIS_PORT) : 6379;;
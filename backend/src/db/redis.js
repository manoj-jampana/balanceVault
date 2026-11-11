import Redis from "ioredis";
import { env } from "../config/env.js";
export const redis = new Redis(env.REDIS_URL,{lazyConnect:true,maxRetriesPerRequest:1,enableReadyCheck:true,retryStrategy:n=>Math.min(n*250,2000)});
redis.on("error",e=>console.error("Redis error:",e.message));
export async function connectRedis(){if(redis.status==="wait") await redis.connect(); await redis.ping();}

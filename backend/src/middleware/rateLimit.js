import {rateLimit} from "express-rate-limit";
import {RedisStore} from "rate-limit-redis";
import {env} from "../config/env.js";
import {redis} from "../db/redis.js";
const store=()=>new RedisStore({sendCommand:(...args)=>redis.call(...args)});
export const generalLimiter=rateLimit({windowMs:env.RATE_LIMIT_WINDOW_MS,limit:env.RATE_LIMIT_MAX,standardHeaders:"draft-7",legacyHeaders:false,store:store(),message:{error:"Too many requests. Try later."}});
export const authLimiter=rateLimit({windowMs:env.RATE_LIMIT_WINDOW_MS,limit:env.AUTH_RATE_LIMIT_MAX,standardHeaders:"draft-7",legacyHeaders:false,store:store(),message:{error:"Too many authentication attempts. Try later."}});

import { Ratelimit} from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis=new Redis({
  url:process.env.UPSTASH_REDIS_REST_URL,
  token:process.env.UPSTASH_REDIS_REST_TOKEN
})
export const ratelimiter=new Ratelimit({
  redis,limiter:Ratelimit.slidingWindow(4,"60s"),
  analytics:true
})
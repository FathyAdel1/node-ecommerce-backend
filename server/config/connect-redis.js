import redis from "redis";

const client = redis.createClient({ url: "redis://redis:6379" });
await client.connect();

export default client;

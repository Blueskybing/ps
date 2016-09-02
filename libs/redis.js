var redis = require("redis"),
    client = redis.createClient(
        CONFIG_REDIS.redis_port, CONFIG_REDIS.redis_host);
client.auth(CONFIG_REDIS.redis_pass);

global._Redis = client;

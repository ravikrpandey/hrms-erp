const Queue = require("bull");

const redisConfig = {
  host: "127.0.0.1",
  port: 6379,

  keepAlive: 30000,

  retryStrategy(times) {

    if (times > 10) {
      console.error("Redis retry limit reached.");
      return null;
    }

    return Math.min(times * 500, 5000);
  },

  reconnectOnError(err) {

    // Reconnect only for connection-related errors

    const targetErrors = [
      "READONLY",
      "ECONNRESET",
      "ETIMEDOUT",
      "EPIPE"
    ];

    if (
      targetErrors.some(code =>
        err.message.includes(code)
      )
    ) {
      console.warn("Redis reconnect triggered:", err.message);
      return true;
    }

    // ❌ Don't reconnect for MISCONF

    return false;
  }
};

const mailQueue = new Queue("mail-queue", {
  redis: redisConfig,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5000
    },

    removeOnComplete: true,

    removeOnFail: false
  },

  settings: {
    stalledInterval: 30000,
    maxStalledCount: 2
  }
});

mailQueue.on("error", (err) => {
  console.error("Bull Queue Error:", err.message);
});

module.exports = mailQueue;
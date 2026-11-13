const path = require('path');
const fs = require('fs');

let logger;

try {
  const winston = require('winston');
  const { createLogger, format, transports } = winston;

  const logDir = path.join(__dirname, '..', 'logs');
  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  } catch (err) {
    console.error('Failed to create logs directory:', err);
  }

  const transportList = [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, timestamp, stack, error, ...meta }) => {
          let log = `${timestamp} [${level}]: ${message}`;
          if (stack) {
            log += `\n${stack}`;
          } else if (error && error.stack) {
            log += `\n${error.stack}`;
          } else if (Object.keys(meta).length > 0) {
            try {
              log += ` ${JSON.stringify(meta)}`;
            } catch (_) {}
          }
          return log;
        })
      ),
    }),
  ];

  if (fs.existsSync(logDir)) {
    transportList.push(
      new transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        maxsize: 5 * 1024 * 1024,
        maxFiles: 5,
        format: format.combine(
          format.timestamp(),
          format.errors({ stack: true }),
          format.json()
        ),
      }),
      new transports.File({
        filename: path.join(logDir, 'combined.log'),
        maxsize: 5 * 1024 * 1024,
        maxFiles: 5,
        format: format.combine(
          format.timestamp(),
          format.errors({ stack: true }),
          format.json()
        ),
      })
    );
  }

  logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: transportList,
  });
} catch (e) {
  logger = {
    info: (...args) => console.log(`[INFO] [${new Date().toISOString()}]`, ...args),
    error: (...args) => console.error(`[ERROR] [${new Date().toISOString()}]`, ...args),
    warn: (...args) => console.warn(`[WARN] [${new Date().toISOString()}]`, ...args),
    debug: (...args) => console.debug(`[DEBUG] [${new Date().toISOString()}]`, ...args),
  };
}

module.exports = logger;

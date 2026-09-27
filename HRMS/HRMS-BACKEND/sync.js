/**
 * ⚙️ sync.js
 *
 * CLI Usage:
 *   node sync.js              → sync entire database
 *   node sync.js user         → sync only "user" table
 */

const fs = require("fs");
const path = require("path");
const db = require("./app/models");

// === Argument Parsing ===
const args = process.argv.slice(2);
const targetTable = args[0] || null;

// === Logging Setup ===
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const logFile = path.join(logDir, `sync_${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: "a" });

function log(msg) {
  const time = new Date().toISOString();
  const line = `[${time}] ${msg}`;
  console.log(line);
  logStream.write(line + "\n");
}

// === Direct DB Sync ===
async function syncDatabase() {
  const sequelize = db.sequelize;
  const dbName = sequelize.config.database;

  log(`🔁 Connecting to database: ${dbName}`);
  await sequelize.authenticate();
  log(`✅ Connected`);

  if (targetTable) {
    if (!db[targetTable]) throw new Error(`Table '${targetTable}' not found in models`);
    log(`🔧 Syncing table '${targetTable}'...`);
    await db[targetTable].sync({ alter: true });
  } else {
    log(`🔧 Syncing entire database...`);
    await sequelize.sync({ alter: true });
  }

  log(`✅ Database sync complete.`);
}

// === MAIN EXECUTION ===
(async () => {
  log("🚀 Starting database sync process...");

  try {
    await syncDatabase();
    log(`✅ Sync process completed successfully`);
  } catch (err) {
    log(`❌ Sync error: ${err.stack || err}`);
  } finally {
    log(`🧾 Logs saved to: ${logFile}`);
    logStream.end();
  }
})();
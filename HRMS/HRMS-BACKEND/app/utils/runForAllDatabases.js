const db = require("../models");

/**
 * Runs a callback across the database
 * @param {Function} callback - async (name, models, sequelize)
 */
exports.runForAllDatabases = async (callback) => {
  const results = [];

  try {
    const sequelize = db.sequelize;
    const models = db;
    const dbName = sequelize.config.database;

    console.log(`\n🏦 Running task for DB: ${dbName}`);
    await callback("default", models, sequelize);
    console.log(`✅ Completed for DB`);
    results.push({ database: dbName, status: "success" });
  } catch (err) {
    console.error(`❌ Failed for DB:`, err.message);
    results.push({ database: "default", status: "failed", error: err.message });
  }

  return results;
};

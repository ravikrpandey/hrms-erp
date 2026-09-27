const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

async function checkAndRunMigrations(sequelize) {
  try {
    const [results] = await sequelize.query("SHOW TABLES LIKE 'MIGRATIONS';");

    if (results.length === 0) {
      //console.log('Creating MIGRATIONS table...');
      await sequelize.getQueryInterface().createTable('MIGRATIONS', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
        },
        logs: {
          type: Sequelize.TEXT('long'),
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('success', 'failed'),
          allowNull: false,
          defaultValue: 'success',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        },
      });
    }

    const migrationFolder = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationFolder).filter(file => file.endsWith('.js'));

    // ✅ Ignore failed migrations
    const [appliedMigrations] = await sequelize.query("SELECT name FROM MIGRATIONS WHERE status != 'failed';");
    const appliedSet = new Set(appliedMigrations.map(m => m.name));

    const pendingMigrations = migrationFiles.filter(file => !appliedSet.has(file));

    // console.log(`✅ Applied in DB: ${appliedSet.size}`);
    // console.log(`📁 Folder Total: ${migrationFiles.length}`);
    // console.log(`🆕 Pending: ${pendingMigrations.length}`);

    for (const file of pendingMigrations) {
      const filePath = path.join(migrationFolder, file);
      const migration = require(filePath);

      try {
        console.log(`➡️ Running migration: ${file}`);

        try {
          await migration.up(sequelize.getQueryInterface(), Sequelize);

          // 🟢 Success path
          await sequelize.query(
            `INSERT INTO MIGRATIONS (name, status, logs)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
              status = IF(status = 'failed', VALUES(status), status),
              logs = VALUES(logs);`,
            {
              replacements: [file, 'success', 'Migration applied successfully'],
            }
          );

          console.log(`✅ Success: ${file}`);
        } catch (innerError) {
          // ⚠️ Check if error is "already exists"
          const knownErrors = ['already exists', 'ER_TABLE_EXISTS_ERROR', 'duplicate column'];
          const isAlreadyApplied = knownErrors.some(e => innerError.message.toLowerCase().includes(e.toLowerCase()));

          const log = {
            timestamp: new Date().toISOString(),
            file,
            error: innerError.message,
            stack: innerError.stack,
          };

          const logJson = JSON.stringify(log);

          await sequelize.query(
            `INSERT INTO MIGRATIONS (name, status, logs)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
              status = IF(status = 'failed', VALUES(status), status),
              logs = VALUES(logs);`,
            {
              replacements: [file, isAlreadyApplied ? 'success' : 'failed', logJson],
            }
          );

          if (isAlreadyApplied) {
            console.warn(`⚠️ Skipped (already applied): ${file}`);
          } else {
            console.error(`❗ Failed: ${file}, logged in DB.`);
          }
        }
      } catch (err) {
        console.error(`🚨 Unexpected Error in migration loop: ${file}`, err);
      }
    }
  } catch (error) {
    console.error('🚨 Migration check failed:', error.message);
  }
}

module.exports = { checkAndRunMigrations };

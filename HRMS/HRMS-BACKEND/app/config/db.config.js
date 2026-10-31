require("dotenv").config();

module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "devuser",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "hrms",
  dialect: "mysql",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  innodb_log_file_size: "512M",
  innodb_strict_mode: 1,
  pool: {
    max: 20,
    min: 0,
    acquire: 120000,
    idle: 60000,
  },
};

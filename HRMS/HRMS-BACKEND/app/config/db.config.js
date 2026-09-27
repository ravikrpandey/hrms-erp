module.exports = {
  HOST: "localhost",
  USER: "devuser",
  PASSWORD: "DevUser@12345!",
  DB: "hrms",
  dialect: "mysql",
  port: 3306,
  innodb_log_file_size: "512M",
  innodb_strict_mode: 1,
  pool: {
    max: 20,
    min: 0,
    acquire: 120000,
    idle: 60000,
  },
};

// Remote Live DB (zyno_uat)
// module.exports = {
//   HOST: "168.231.121.201",
//   USER: "hrms_user",
//   PASSWORD: "Min!321#!!",
//   DB: "zyno_uat",
//   dialect: "mysql",
//   port: 3306,
//   pool: {
//     max: 20,
//     min: 0,
//     acquire: 120000,
//     idle: 60000,
//   },
// };

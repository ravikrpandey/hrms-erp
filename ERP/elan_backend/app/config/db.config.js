module.exports = {
    HOST: "localhost",
    USER: "devuser",
    PASSWORD: "DevUser@12345!",
    DB: "hrms",
    port: 3306,
    dialect: "mysql",
    innodb_log_file_size: "512M",
    innodb_strict_mode: 1,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}
const sql = require('mssql');

const sqlServerConfig = {
    user: 'newtool',
    password: '123456789',
    server: '3.64.137.194',
    database: 'attendance',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true 
    }
};
// const sqlServerConfig = {
//     user: 'datasync',
//     password: '123456',
//     server: '3.64.137.194',
//     database: 'HRMSattendanceReplica',
//     port: 1433,
//     options: {
//         encrypt: true,
//         trustServerCertificate: true 
//     }
// };

const WFHsqlServerConfig = {
    user: 'newtool',
    password: '123456789',
    server: '3.64.137.194',
    database: 'ActivityDatabaseReplica',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true 
    }
};

let pool;

const connectToSqlServer = async () => {
    if (!pool) {
        try {
            pool = await sql.connect(sqlServerConfig);
            console.log('Connected to SQL Server');
        } catch (error) {
            console.error('SQL Server connection error:', error.message);
            throw error;
        }
    }
    return pool;
};

let newpool;
const connectToWfhSQLServer = async () => {
    if (!newpool) {
        try {
            newpool = await sql.connect(WFHsqlServerConfig);
            console.log('Connected to WFH SQL Server');
        } catch (error) {
            console.error('WFH SQL Server connection error:', error.message);
            throw error;
        }
    }
    return newpool;
};

const closeSqlServerConnection = async () => {
    if (pool) {
        await pool.close();
        pool = null;
        console.log('SQL Server connection closed');
    }
    if (newpool) {
        await newpool.close();
        newpool = null;
        console.log('WFH SQL Server connection closed');
    }
};

module.exports = {
    connectToSqlServer,
    connectToWfhSQLServer,
    closeSqlServerConnection,
};
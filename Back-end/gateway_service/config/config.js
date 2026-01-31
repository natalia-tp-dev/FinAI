require('dotenv').config()
const mysql = require('mysql2/promise')

//Connection
const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_GATEWAY_USER,
    password: process.env.DB_GATEWAY_PASSWORD,
    database: process.env.DB_GATEWAY_NAME,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    idleTimeout: 60000,
    ssl: {
        rejectUnauthorized: false
    } 
});

//Handle connection errors
pool.on('error', (err) => {
    console.error('Unexpected error with MYSQL pool ', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Connection with database lost.')
    }
})

//Detect Docker signals
const gracefulShutdown = async () => {
    console.log('Closing pool connections');
    await pool.end()
    console.log('Pool closed, exiting...');
    //process.exit(0)
}
/*
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
*/
module.exports = pool
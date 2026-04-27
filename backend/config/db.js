// ===== Database Configuration =====
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',  // Change if you have a MySQL password
    database: 'service_finder',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;

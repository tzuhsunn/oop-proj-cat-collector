const mysql = require('mysql2/promise');

async function createConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connection successful');
        return connection;
    } catch (err) {
        console.error('Connection error', err);
        throw err; // Rethrow the error to handle it outside or to fail loudly
    }
}

module.exports = createConnection;
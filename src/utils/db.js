require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const query = (sql, values, callback) => {
    pool.connect((err, client) => {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        client.query(sql, values, (error, results) => {
            client.release();
            if (error) {
                callback(error, null);
            } else {
                callback(null, results.rows);
            }
        });
    });
};

module.exports = {
    query,
};
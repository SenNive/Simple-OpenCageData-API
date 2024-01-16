require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    // ssl: {
    //     rejectUnauthorized: false
    // }
});

const query = async (text, params) => {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res.rows;
    } finally {
        client.release();
    }
};

module.exports = { query };
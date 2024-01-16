// import env
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

async function initializeDatabase(req, res) {
    try {
        const client = await pool.connect();
        // const result = await client.query(`
        //     CREATE TABLE IF NOT EXISTS mapserviceusers (
        //         id SERIAL PRIMARY KEY,
        //         username VARCHAR(255) UNIQUE NOT NULL,
        //         email VARCHAR(255) NOT NULL
        //     );
        // `);


        // const result = await client.query(`
        //     INSERT INTO mapserviceusers (username, email) VALUES
        //     ('Budi', 'budi@gmail.com'),
        //     ('Awi', 'awi@gmail.com');
        // `);


        const result = await client.query(`
            SELECT * FROM mapserviceusers;
        `);

        client.release();

        console.log(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
    }
}

initializeDatabase();
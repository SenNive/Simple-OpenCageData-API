import { sql } from '@vercel/postgres';

const initializeDatabase = async () => {
    try {
        const result = await sql`
            CREATE TABLE IF NOT EXISTS mapserviceusers (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) NOT NULL
            );
        `;
        console.log('Table mapserviceusers created successfully!', result);
    } catch (error) {
        console.error('Error executing query', error);
    }
};

const insertDummyData = async () => {
    try {
        const result = await sql`
            INSERT INTO mapserviceusers (username, email) VALUES
            ('Budi', 'budi@gmail.com'),
            ('Awi', 'awi@gmail.com');
        `;
        console.log('Dummy data inserted successfully!', result);
    } catch (error) {
        console.error('Error executing query', error);
    }
};

initializeDatabase();
insertDummyData();
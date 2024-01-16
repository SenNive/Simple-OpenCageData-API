import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS mapserviceusers (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) NOT NULL
            );
        `;

        await sql`
            INSERT INTO mapserviceusers (username, email) VALUES
            ('Budi', 'budi@gmail.com'),
            ('Awi', 'awi@gmail.com');
        `;

        res.status(200).send('Table mapserviceusers created and dummy data inserted successfully!');
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Error executing query');
    }
}
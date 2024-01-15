const mysql = require('mysql2');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webtech3',
};

const pool = mysql.createPool(dbConfig);

const query = (sql, values, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        connection.query(sql, values, (error, results, fields) => {
            connection.release();
            callback(error, results);
        });
    });
};

module.exports = {
    query,
};
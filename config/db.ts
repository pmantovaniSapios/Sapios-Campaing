import mariadb from "mariadb";

export const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sapios',
    database: 'campaing',
    port: 3306,
    connectionLimit: 5
})
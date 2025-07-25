import mysql from "mysql";

export const db = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    database: 'food_blog',
    user: 'root',
    password: 'H@cker22',
})

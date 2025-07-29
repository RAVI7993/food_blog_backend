import mysql from "mysql";

export const db = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    database: 'food_blog1',
    user: 'root',
    password: 'H@cker22',
})

const mysql = require("mysql2");
try {
    const pool = mysql.createPool(
        {
            host: "localhost",
            user: "root",
            password: "",
            port: 3306,
            database: "practice_db"
        }
    );
    module.exports = pool.promise();
} catch (error) {
    console.error("error occured in database connection", error);
}
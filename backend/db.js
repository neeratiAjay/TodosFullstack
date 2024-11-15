const sqlite3 = require("sqlite3").verbose()
const Database = require('better-sqlite3')
const db = new sqlite3.Database("./todo.db")

db.serialize(()=>{
 
    db.run(`CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT ,
        name VARCHAR(250) NOT NULL,
        username VARCHAR(300),
        email TEXT,
        password TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS todo (
        id VARCHAR(400) PRIMARY KEY,
        user_id INTEGER,
        title TEXT,
        status TEXT,
        FOREIGN KEY (user_id) REFERENCES user (id)
    )`);
   

});
module.exports = db
import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('database/database.db', { verbose: console.log });

const exeSql = fs.readFileSync("database/initdb.sql", 'utf8');;

db.exec(exeSql);

export function getUsers(): Object
{
    const query = db.prepare("SELECT name FROM user");
    const users = query.all();
    
    return users;
};

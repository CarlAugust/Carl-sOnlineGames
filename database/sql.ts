import Database from 'better-sqlite3';
import fs from 'fs';
import {User} from '../types/sql-types'

const db = new Database('database/database.db', { verbose: console.log });

const exeSql = fs.readFileSync("database/initdb.sql", 'utf8');;

db.exec(exeSql);

export function getUsers(): User[]
{
    const query = db.prepare("SELECT name FROM user");
    const users = query.all() as User[];
    
    return users;
};

export function getUserPassword(name: String): User
{
    const query = db.prepare("SELECT password FROM user");
    const user = query.get() as User;
    return user;
}
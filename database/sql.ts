import Database from 'better-sqlite3';
import fs from 'fs';
import { User, Count, GameResult } from '../types/sql-types'

const db = new Database('database/database.db', { verbose: console.log });

const exeSql = fs.readFileSync("database/initdb.sql", 'utf8');;

db.exec(exeSql);

export function getUsers(): User[]
{
    const query = db.prepare("SELECT name FROM user");
    const users = query.all() as User[];
    
    return users;
};

export function checkUser(username: String): Boolean
{
    const query = db.prepare("SELECT COUNT(*) as count FROM user WHERE name = ?");
    const result = query.get(username) as Count;
    
    if (result.count == 0)
    {
        return false;
    }
    
    return true;
}

export function insertUser(user: User): Number | BigInt
{
    const query = db.prepare("INSERT INTO user (name, password) VALUES (?, ?)");
    const result = query.run(user.username, user.password);

    return result.lastInsertRowid;
}

export function getUserPassword(name: String): User
{
    const query = db.prepare("SELECT password, id FROM user WHERE name = ?");
    const user = query.get(name) as User;
    return user;
}

export function insertGameResult(gameResult: GameResult): Number | BigInt
{
    const query = db.prepare("INSERT into GameResult (result, score, nameId, gameId) VALUES (?,?,?,?)");
    const result = query.run(gameResult.userId, gameResult.gameId, gameResult.result, gameResult.score);

    return result.lastInsertRowid;
}
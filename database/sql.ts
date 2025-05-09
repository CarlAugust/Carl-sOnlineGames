import Database from 'better-sqlite3';
import fs from 'fs';
import { User, Count, GameResult, role, RoleAndIdUser } from '../types/sql-types'

const db = new Database('database/database.db');

const exeSql = fs.readFileSync("database/initdb.sql", 'utf8');

db.exec(exeSql);

// Error if roles already exist
try {
    db.prepare("INSERT INTO ROLE (name) VALUES ('Admin'), ('User')").run();
}
catch (err){}

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

export function insertUser(user: User): RoleAndIdUser
{
    const insertQuery = db.prepare("INSERT INTO user (name, password, roleId) VALUES (?, ?, ?)");
    const result = insertQuery.run(user.username, user.password, user.role);

    const id = result.lastInsertRowid;

    const selectQuery = db.prepare("SELECT roleId FROM user WHERE id = ?")
    const roleIdObject = selectQuery.get(id) as any;
    const roleId = roleIdObject.roleId as role;

    const roleAndIdUser: RoleAndIdUser = {
        id: id,
        role: roleId
    }
    return roleAndIdUser;
}

export function getUserPassword(name: String): User
{
    const query = db.prepare("SELECT password, id, roleId as role FROM user WHERE name = ?");
    const user = query.get(name) as User;
    return user;
}

export function insertGameResult(gameResult: GameResult): Number | BigInt
{
    const query = db.prepare("INSERT into GameResult (userId, nameId, result, score) VALUES (?,?,?,?)");
    const result = query.run(gameResult.userId, gameResult.nameId, gameResult.result, gameResult.score);

    return result.lastInsertRowid;
}

// For getAllGameResults
export interface UserAndGameResults
{
    user: String,
    userRole: role,
    score: Number,
    result: Number

}

export function getAllGameResults(): UserAndGameResults[]
{
    // Using a query like this might cause a problem later because im getting all the gameResult data
    const query = db.prepare(`SELECT 
                                user.name as user,
                                user.roleId as userRole,
                                gameResult.score as score,
                                gameResult.result as result
                            FROM gameResult
                            INNER JOIN user on gameresult.userId = user.id
                            INNER JOIN game on gameresult.nameId = game.id
                            `);

    const result = query.all() as UserAndGameResults[];
    return result;
}
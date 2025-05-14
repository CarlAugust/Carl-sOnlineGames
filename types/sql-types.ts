
// SHOULD MATCH WITH DATABASE ID AND NAME!!!
export enum role {
    admin = 1,
    user = 2
}

export interface User {
    id: Number | BigInt;
    username: string;
    email?: string;
    password: string;
    role: role;
    countryCode: String;
    continent: String;
}

export interface RoleAndIdUser {
    id: Number | BigInt;
    role: role;
}

export interface GameResult {
    id?: Number | BigInt;
    userId: Number | BigInt;
    nameId: Number;
    score: Number;
    result: Number;
}

export interface Count {
    count: Number;
}
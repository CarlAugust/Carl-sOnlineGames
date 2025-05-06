export interface User {
    id: Number | BigInt;
    username: string;
    password: string;
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
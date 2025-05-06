export interface User {
    id: Number | BigInt;
    username: string;
    password: string;
}

export interface GameResult {
    id?: Number | BigInt;
    userId: Number | BigInt;
    gameId: Number;
    score: Number;
    result: Number;
}

export interface Count {
    count: Number;
}
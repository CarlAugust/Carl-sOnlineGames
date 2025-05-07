import { role } from './sql-types';

export interface SessionUser
{
    id: Number | BigInt;
    name: string;
    role: role;
}
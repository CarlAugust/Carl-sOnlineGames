import { role } from './sql-types';

export interface SessionUser
{
    id: Number | BigInt;
    name: String;
    role: role;
    countryCode?: String;
}
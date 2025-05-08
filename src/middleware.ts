import { Request, Response, NextFunction } from 'express';
import { SessionUser } from "../types/express-types";

declare module 'express-session' {
    interface SessionData {
        user: SessionUser;
    }
}

export function checkLoggedIn(req: Request, res: Response, next: NextFunction)
{
    if (req.session.user)
    {
        next();
    }
    else
    {
        return res.redirect("/login");
    }
}

// Example admin function
/*
export function checkAdmin(req: Request, res: Response, next: NextFunction)
{
    if (req.session.user.role = sqlType.role.admin)
    {
        next();
    }
    else
    {
        return res.status(400).json({error: 'Unauthorized user'})   
    }
}
*/

function commitbro() {
    console.log("hi");
}
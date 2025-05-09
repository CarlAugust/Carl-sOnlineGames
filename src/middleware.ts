import { Request, Response, NextFunction } from 'express';
import { SessionUser } from "../types/express-types";
import { role } from "../types/sql-types";

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

export function checkAdmin(req: Request, res: Response, next: NextFunction)
{
    if (req.session.user != undefined && req.session.user.role == role.admin)
    {
        next();
    }
    else
    {
        return res.redirect('/main');   
    }
}
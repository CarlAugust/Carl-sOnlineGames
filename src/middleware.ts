import { Request, Response, NextFunction } from 'express';
import { SessionUser } from "../types/express-types";

declare module 'express-session' {
    interface SessionData {
        user: SessionUser;
    }
}

export function checkLoggedIn(req: Request, res: Response, next: NextFunction)
{
    console.log(req.session.user);
    if (req.session.user)
    {
        console.log("Success");
        next();
    }
    else
    {
        console.log("Fail");
        return res.redirect("/login");
    }
}
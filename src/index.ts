import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt, { genSaltSync } from "bcrypt";
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from "path";

declare module 'express-session' {
  interface SessionData {
    user: SessionUser;
  }
}

import * as sql from "../database/sql";
import * as mw from "./middleware";
import * as stats from './statistics'
import { SessionUser } from "../types/express-types";
import { User, GameResult, role } from "../types/sql-types";
import { Sign } from "crypto";
import { PathParams } from "express-serve-static-core";

const ppath = "../public";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(session({
  secret: "pretty secret",
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', mw.checkLoggedIn, (req: Request, res: Response) => {
  res.redirect('/main');
});

interface Routes {
  paths: PathParams[],
  middleWare: any[]
}

const routes: Routes[] = [
  {
    paths: ['/login', '/login/*'],
    middleWare: []
  },
  {
    paths: ['/main', '/main/*'],
    middleWare: [mw.checkLoggedIn]
  },
  {
    paths: ['/game/random', '/game/random/*'],
    middleWare: [mw.checkLoggedIn]
  },
  {
    paths: ['/game/premium', '/game/premium/*'],
    middleWare: [mw.checkLoggedIn, mw.checkAdmin]
  },
  {
    paths: ['/user', '/user/*'],
    middleWare: [mw.checkLoggedIn]
  },
  {
    paths: ['/privacypolicy', '/privacypolicy/*'],
    middleWare: []
  }
];

routes.forEach(route => {
  route.paths.forEach(pathStr => {
    app.get(pathStr, ...route.middleWare, (req: Request, res: Response) => {
      try {
        res.sendFile(path.join(__dirname, `${ppath}/${route.paths[0]}`));
      }
      catch (err)
      {
        console.error('Error sending file', err);
        res.status(500).send('Internal server error');
      }
    })
  })
});

app.post('/login/attempt', async (req: Request, res: Response) => {
  let user: User = req.body as User;
  const dbUser = sql.getUserPassword(user.username);
  if (!dbUser)
  {
    res.status(400).json({ error: 'Invalid credentials'});
    return;
  }

  const valid = await bcrypt.compare(user.password, dbUser.password);
  if (!valid)
  {
    res.status(400).json({error: 'Wrong password'});
    return;
  }
  req.session.user = { id: dbUser.id, name: user.username, role: dbUser.role, personalised: dbUser.personalised, countryCode: dbUser.countryCode };
  res.json({redirect: '/'})
});

app.post('/signin/attempt', async (req: Request, res: Response) => {
  let user = req.body as User;
  user.role = role.user;

  if (sql.checkUser(user.username, user.email)) { 
    res.status(400).json({ error: "User already exists" });
    return; 
  }

  try {
    const passwordHash = await bcrypt.hash(user.password, 10);
    user.password = passwordHash;

    if (user.personalised == 1)
    {
      const ip = '82.134.25.142'; // Hard coded
      const ipApiResponse = await fetch(`http://ip-api.com/json/${ip}`, {
        method: "GET"
      });
      const ipData = await ipApiResponse.json() as any;
      user.countryCode = ipData.countryCode;
    }

    const result = sql.insertUser(user);

    req.session.user = { id: result.id, name: user.username, role: result.role, personalised: user.personalised, countryCode: user.countryCode };
    res.json({ redirect: '/' });  
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

app.get('/logout', async (req: Request, res: Response) => {
  req.session.destroy((err) =>{
    if(err)
    {
      console.error(err);
      res.status(500).json({error: 'Internal server error'});
      return;
    }
    res.redirect('/login');
  });
});

app.get('/game/random/play', (req: Request, res: Response) => {
  const n = Math.floor(Math.random() * 10000);

  let gameResult: GameResult = {
    nameId: 1, // Hard coded for now
    userId: req.session.user?.id ?? 0, // Default to 0 if undefined
    score: n,
    result: 1
  };
  try {
    sql.insertGameResult(gameResult);
    res.json({score: n});
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: "internal server error"});
  }
});

app.get('/game/premium/play', (req: Request, res: Response) => {
  let gameResult: GameResult = {
    nameId: 1, // Hard coded for now
    userId: req.session.user?.id ?? 0, // Default to 0 if undefined
    score: 10000,
    result: 1
  };
  try {
    sql.insertGameResult(gameResult);
    res.json({score: 10000});
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: "internal server error"});
  }
});

app.get('/api/leaderboardListing', mw.checkLoggedIn, (req: Request, res: Response) => {
  try {
    const data = sql.getAllGameResults();
    const formatData = stats.createLeaderBoardListing(data);
    res.json(formatData);
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: 'Something went wrong'})
  }
});

app.get('/api/fetchUser', mw.checkLoggedIn, (req: Request, res: Response) => {
  try {
    res.json(req.session.user);
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  }
});

app.delete('/deleteUser', mw.checkLoggedIn, (req: Request, res: Response) => {
  try {
    sql.deleteUser(req.session.user?.id);
    res.json({redirect: '/login'})
  } catch (err)
  {
    res.status(500).json({error: 'internal server error'});
  }
})

app.post('/updateCookie', mw.checkLoggedIn, (req: Request, res: Response) => {
  try {
    sql.updateCookie(req.body.personalised, req.session.user?.id);

    if (req.session.user) {
        req.session.user.personalised = req.body.personalised;
    }
    res.json({message: "Nice"});
  } catch (err)
  {
    res.json({error: "not nice"});
  }
})

app.use(express.static(path.join(__dirname, '../public')));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
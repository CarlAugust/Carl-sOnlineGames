import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
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
import { SessionUser } from "../types/express-types";

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
  res.render("main");
});

app.get('/login', (req: Request, res: Response) => {
  res.render("login", {error: ""});
});

app.post('/login/attempt', (req: Request, res: Response) => {
  const user = sql.getUserPassword(req.body.name);

  if (user == undefined)
  {
    res.render("login", {error: "User does not exist"});
    return;
  }

  let correctPassword; 
  bcrypt.compare(user.password, req.body.password, function(err, result){
    correctPassword = result;
  });

  if (!correctPassword)
  {
    res.render("login", {error: "Wrong password"});
    return;
  }

  if (req.session.user) {
    req.session.user.id = user.id;
    req.session.user.name = user.name;
  }

  res.redirect("/"); 
});

app.use(express.static(path.join(__dirname, '../public')));
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
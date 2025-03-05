import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

import * as sql from "../database/sql";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => {
  const users: object = sql.getUsers();
  res.render('index', { users: users });
});

app.post('/login', (req: Request, res: Response) => {
  console.log(req.body);
  res.send("Succ");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
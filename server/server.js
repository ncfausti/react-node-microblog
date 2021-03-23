import cors from 'cors'
import express from 'express'

import { register, login } from './routes.js';

const server = express();


server.use(cors());
server.options('*', cors());
server.use(express.json());


server.get('/test', (req, res) => {
  res.send("connected");
});

server.post('/user', register);
server.post('/login', login);

export default server;


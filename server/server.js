const cors = require('cors');
const express = require('express');

var routes = require("./routes.js")

const server = express();

server.use(cors());
server.options('*', cors());
server.use(express.json());


server.get('/test', (req, res) => {
  res.send("connected");
});

server.post('/user', routes.register);
server.post('/login', routes.login);

server.listen(5001, () => console.log("server listening on port 5001"));
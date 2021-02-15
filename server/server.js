const cors = require('cors');
const express = require('express');

const server = express();

server.use(cors());
server.options('*', cors());


server.get('/test', (req, res) => {
    res.send("connected");
});
server.listen(5001, () => console.log("server listening on port 5001"));
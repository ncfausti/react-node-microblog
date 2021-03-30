const mysql = require('mysql');
const config = require('./db-config.js');

config.connectionLimit = 20;
const connection = mysql.createPool(config);

const register = (req, res) => {
  if (req.body.username != 'test') {
    res.status(400).json({
      status: 'err',
      msg: '✖ Registration failed: Invalid username or password provided.',
    });
  } else {
    res.status(201).json({
      status: 'ok',
      msg: 'Registration was successfull.',
    });
  }
};

const login = (req, res) => {
  if (req.body.username != 'test') {
    res.status(400).json({
      status: 'err',
      msg: '✖ Login failed: Invalid username or password provided.',
    });
  } else {
    res.status(201).json({
      status: 'ok',
      msg: 'Login was successfull.',
    });
  }
};

const dbTest = (req, res) => {
  const name = req.query.name || 'default';
  const query = `
    INSERT INTO Test (s_name)
    VALUES ('${name}');
  `;

  connection.query(query, (err, rows) => {
    if (err) res.json(err);
    else {
      res.json(rows);
    }
  });
};

module.exports = {
  register, login, dbTest,
};

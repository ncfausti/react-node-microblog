const mysql = require('mysql');
const config = require('./db-config.js');

config.connectionLimit = 20;
const connection = mysql.createPool(config);

const validatePassword = (uesrInput, dbRecord) => uesrInput == dbRecord;

const unsuccessfulAttempts = new Map();

// POST: /user
const register = (req, res) => {
  const {
    username, password, nickname, email,
  } = req.body;
  if (!username || !password || username == '' || password == '') {
    res.status(400).json({
      status: 'err',
      msg: '✖ Registration failed: Username or password cannot be empty.',
    });
    return;
  }
  if (username.length > 31 || password.length > 31) {
    res.status(400).json({
      status: 'err',
      msg: '✖ Registration failed: Username or password is too long.',
    });
    return;
  }
  const query = `
    INSERT INTO User (username, password, nickname, email)
    VALUES ('${username}', '${password}', '${nickname}', '${email}');
  `;
  connection.query(query, (err, rows) => {
    if (err) {
      res.status(400).json({
        status: 'err',
        msg: '✖ Registration failed: The username already exists.',
      });
    } else {
      res.status(201).json({
        status: 'ok',
        id: rows.insertId,
      });
    }
  });
};

// POST: /login
const login = (req, res) => {
  const { username, password } = req.body;

  if (unsuccessfulAttempts.has(username)
      && unsuccessfulAttempts.get(username).cnt >= 5
      && (Date.now() - unsuccessfulAttempts.get(username).lastAttemp) <= 180000) {
    res.status(403).json({
      status: 'err',
      msg: '✖ Login failed: Too many unsuccessful attempts, please try again later.',
    });
    return;
  }

  const query = `
    SELECT password
    FROM User
    WHERE username='${username}';
  `;
  connection.query(query, (err, rows) => {
    if (err) {
      res.status(500).json({
        status: 'err',
        msg: '✖ Login failed: Internal server error.',
      });
    } else if (validatePassword(password, rows[0].password)) {
      res.status(200).json({
        status: 'ok',
      });
      if (unsuccessfulAttempts.has(username)) {
        unsuccessfulAttempts.delete(username);
      }
    } else {
      if (!unsuccessfulAttempts.has(username)
          || (Date.now() - unsuccessfulAttempts.get(username).lastAttemp) > 10000) {
        unsuccessfulAttempts.set(username, {
          cnt: 1,
          lastAttemp: Date.now(),
        });
      } else {
        unsuccessfulAttempts.set(username, {
          cnt: unsuccessfulAttempts.get(username).cnt + 1,
          lastAttemp: Date.now(),
        });
      }
      res.status(400).json({
        status: 'err',
        msg: '✖ Login failed: Invalid username or password provided.',
      });
    }
  });
};

// GET: /user/{username}
const getUser = (req, res) => {
  const { username } = req.params;
  const query = `
    SELECT *
    FROM User
    WHERE username='${username}';
  `;
  connection.query(query, (err, rows) => {
    if (err) {
      res.status(500).json({
        status: 'err',
        msg: '✖ Query failed: Internal server error.',
      });
    } else if (rows.length >= 1) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({
        status: 'err',
        msg: '✖ Query failed: Username does not exist.',
      });
    }
  });
};

// change password
const resetPsw = (req, res) => {
  const { username } = req.params;
  const { password, email } = req.body;

  // verify email address
  const query = `
    UPDATE User
    SET password=${password}
    WHERE username='${username}' AND email='${email}';
  `;
  connection.query(query, (err, rows) => {
    if (err) {
      res.status(400).json({
        status: 'err',
        msg: '✖ Update failed: Invalid information provided.',
      });
    } else if (rows.affectedRows > 0) {
      res.status(200).json({
        status: 'ok',
      });
    } else {
      res.status(400).json({
        status: 'err',
        msg: '✖ Update failed: Incorrect combination of username and email.',
      });
    }
  });
};

// GET: /users
const getUsers = (req, res) => {
  const limit = req.query.limit || '100';
  const query = `
    SELECT *
    FROM User
    LIMIT ${limit};
  `;
  connection.query(query, (err, rows) => {
    if (err) {
      res.status(500).json({
        status: 'err',
        msg: '✖ Query failed: Internal server error.',
      });
    } else {
      res.status(200).json(rows);
    }
  });
};

module.exports = {
  register, login, getUser, getUsers, resetPsw,
};

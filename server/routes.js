const mysql = require('mysql');
const config = require('./db-config.js');

config.connectionLimit = 20;
const connection = mysql.createPool(config);

const validatePassword = (uesrInput, dbRecord) => uesrInput == dbRecord;

const unsuccessfulAttempts = new Map();

// POST: /user
const register = (req, res) => {
  const {
    username, password, nickname, email, avatarRef, summary,
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
    INSERT INTO User (username, password, nickname, email, avatar_ref, summary)
    VALUES ('${username}', '${password}', '${nickname}', '${email}', '${avatarRef}', '${summary}');
  `;
  connection.query(query, (err, rows) => {
    if (err) {
      res.status(409).json({
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
    SET password='${password}'
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

// activate / deactivate
const changeUserActivation = (req, res) => {
  const { username } = req.params;
  /* eslint-disable camelcase */
  const { is_active } = req.body;

  const query = `
    UPDATE User
    SET is_active=${is_active}
    WHERE username='${username}';
  `;
  /* eslint-enable camelcase */
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
        msg: '✖ Update failed: Invalid information provided.',
      });
    }
  });
};

const createPost = (req, res) => {
  const { userid, content, media } = req.body;
  const query = `
    INSERT INTO Post (ownerid, content, media)
    VALUES (?, ?, ?);
  `;
  connection.query(query, [userid, content, media], (err) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(201).json({ status: 'ok' });
    }
  });
};

const getPosts = (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const query = `
    SELECT *
    FROM Post JOIN User
    ON Post.ownerid=User.userid
    ORDER BY creation_date DESC
    LIMIT 5 OFFSET ?;
  `;
  connection.query(query, [(page - 1) * 5], (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
};

const getPostsByUser = (req, res) => {
  const { userid } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const query = `
    SELECT *
    FROM Post JOIN User
    ON Post.ownerid=User.userid
    WHERE ownerid=${userid}
    ORDER BY creation_date DESC
    LIMIT 5 OFFSET ?;
  `;
  connection.query(query, [(page - 1) * 5], (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
};

const getFeed = (req, res) => {
  const { userid } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const query = `
    SELECT *
    FROM Post JOIN User
    ON Post.ownerid=User.userid
    WHERE (ownerid IN (
      SELECT user1
      FROM Follows
      WHERE user0=${userid}
    ) AND ownerid NOT IN (
      SELECT user1
      FROM Blocks
      WHERE user0=${userid}
    ) AND postid NOT IN (
      SELECT postid
      FROM Hides
      WHERE userid=${userid}
    ) AND User.is_active=true
    )
    OR ownerid=${userid}
    ORDER BY creation_date DESC
    LIMIT 5 OFFSET ?;
  `;
  connection.query(query, [(page - 1) * 5], (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
};

const hidePost = (req, res) => {
  const { userid, postid } = req.body;
  const query = `
    INSERT INTO Hides (userid, postid)
    VALUES (${userid}, ${postid});
  `;
  connection.query(query, (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
};

const deletePost = (req, res) => {
  const { postid } = req.params;
  const query = `
    DELETE FROM Post
    WHERE postid=${postid};
  `;
  connection.query(query, (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
};

const getCommentsByPost = (req, res) => {
  const { postid } = req.params;
  const query = `
    SELECT c.*, u.userid, u.username, u.nickname, u.avatar_ref
    FROM Comment c JOIN User u
      ON c.ownerid = u.userid
    WHERE c.postid=${postid}
    ORDER BY c.creation_date DESC;
  `;
  connection.query(query, (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
};

const getFollowings = (req, res) => {
  const { id } = req.params;
  const query = `
    WITH f AS (
      SELECT user1
      FROM Follows
      WHERE user0=${id}
    )
    SELECT User.*
    FROM f JOIN User
    ON f.user1=User.userid;
  `;
  connection.query(query, (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
};

const addFollow = (req, res) => {
  const { user0, user1 } = req.body;
  const query = `
    INSERT INTO Follows (user0, user1)
    VALUES (${user0}, ${user1});
  `;
  connection.query(query, (err) => {
    if (err) {
      res.status(400).json({
        msg: 'Duplicate follows.',
      });
      console.log(err);
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
};

const deleteFollow = (req, res) => {
  const { user0, user1 } = req.body;
  const query = `
    DELETE FROM Follows
    WHERE user0=${user0} AND user1=${user1};
  `;
  connection.query(query, (err) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
};

const getBlockings = (req, res) => {
  const { id } = req.params;
  const query = `
    WITH b AS (
      SELECT user1
      FROM Blocks
      WHERE user0=${id}
    )
    SELECT User.*
    FROM b JOIN User
    ON b.user1=User.userid;
  `;
  connection.query(query, (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
};

const addBlock = (req, res) => {
  const { user0, user1 } = req.body;
  const query = `
    INSERT INTO Blocks (user0, user1)
    VALUES (${user0}, ${user1});
  `;
  connection.query(query, (err) => {
    if (err) {
      res.status(400).json({
        msg: 'Duplicate blocks.',
      });
      console.log(err);
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
};

const deleteBlock = (req, res) => {
  const { user0, user1 } = req.body;
  const query = `
    DELETE FROM Blocks
    WHERE user0=${user0} AND user1=${user1};
  `;
  connection.query(query, (err) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
};

const newComment = (req, res) => {
  const {
    ownerid,
    postid,
    content,
    replyingTo,
  } = req.body;
  const query = `
    INSERT INTO Comment (ownerid, postid, content, replying_to)
    VALUES (?, ?, ?, ?);
  `;
  connection.query(query, [ownerid, postid, content, replyingTo], (err) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
};

const deleteComment = (req, res) => {
  const { commentid } = req.params;
  const query = `
    DELETE FROM Comment
    WHERE commentid=${commentid};
  `;
  connection.query(query, (err) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
};

module.exports = {
  register,
  login,
  getUser,
  getUsers,
  resetPsw,
  changeUserActivation,
  createPost,
  getPosts,
  getPostsByUser,
  getFeed,
  hidePost,
  deletePost,
  getCommentsByPost,
  getFollowings,
  addFollow,
  deleteFollow,
  getBlockings,
  addBlock,
  deleteBlock,
  newComment,
  deleteComment,
};

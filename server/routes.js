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
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  connection.query(
    query,
    [username, password, nickname, email, avatarRef, summary],
    (err, rows) => {
      if (err) {
        res.status(409).json({
          status: 'err',
          msg: '✖ Registration failed: The username already exists.',
        });
        console.log(err);
      } else {
        res.status(201).json({
          status: 'ok',
          id: rows.insertId,
        });
      }
    },
  );
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
    WHERE username=?;
  `;
  connection.query(query, [username], (err, rows) => {
    if (err) {
      res.status(500).json({
        status: 'err',
        msg: '✖ Login failed: Internal server error.',
      });
    } else if (rows.length === 0) {
      res.status(400).json({
        status: 'err',
        msg: '✖ Login failed: Invalid username or password provided.',
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
    WHERE username=?;
  `;
  connection.query(query, [username], (err, rows) => {
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
    SET password=?
    WHERE username=? AND email=?;
  `;
  connection.query(query, [password, username, email], (err, rows) => {
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
  const limit = parseInt(req.query.limit, 10) || 100;
  const query = `
    SELECT *
    FROM User
    LIMIT ?;
  `;
  connection.query(query, [limit], (err, rows) => {
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
    SET is_active=?
    WHERE username=?;
  `;
  connection.query(query, [is_active, username], (err, rows) => {
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
  /* eslint-enable camelcase */
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
  const userid = parseInt(req.params.userid, 10);
  const page = parseInt(req.query.page, 10) || 1;
  const query = `
    SELECT *
    FROM Post JOIN User
    ON Post.ownerid=User.userid
    WHERE ownerid=?
    ORDER BY creation_date DESC
    LIMIT 5 OFFSET ?;
  `;
  connection.query(query, [userid, (page - 1) * 5], (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
};

const getFeed = (req, res) => {
  const userid = parseInt(req.params.userid, 10);
  const page = parseInt(req.query.page, 10) || 1;
  const query = `
    SELECT *
    FROM Post JOIN User
    ON Post.ownerid=User.userid
    WHERE (ownerid IN (
      SELECT user1
      FROM Follows
      WHERE user0=?
    ) AND ownerid NOT IN (
      SELECT user1
      FROM Blocks
      WHERE user0=?
    ) AND postid NOT IN (
      SELECT postid
      FROM Hides
      WHERE userid=?
    ) AND User.is_active=true
    )
    OR ownerid=?
    ORDER BY creation_date DESC
    LIMIT 5 OFFSET ?;
  `;
  connection.query(query, [userid, userid, userid, userid, (page - 1) * 5], (err, rows) => {
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
    VALUES (?, ?);
  `;
  connection.query(query, [userid, postid], (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
};

const deletePost = (req, res) => {
  const postid = parseInt(req.params.postid, 10);
  const query = `
    DELETE FROM Post
    WHERE postid=?;
  `;
  connection.query(query, [postid], (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
};

const getCommentsByPost = (req, res) => {
  const postid = parseInt(req.params.postid, 10);
  const query = `
    SELECT c.*, u.userid, u.username, u.nickname, u.avatar_ref
    FROM Comment c JOIN User u
      ON c.ownerid = u.userid
    WHERE c.postid=?
    ORDER BY c.creation_date DESC;
  `;
  connection.query(query, [postid], (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
};

const getFollowings = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const query = `
    WITH f AS (
      SELECT user1
      FROM Follows
      WHERE user0=?
    )
    SELECT User.*
    FROM f JOIN User
    ON f.user1=User.userid;
  `;
  connection.query(query, [id], (err, rows) => {
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
    VALUES (?, ?);
  `;
  connection.query(query, [user0, user1], (err) => {
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
    WHERE user0=? AND user1=?;
  `;
  connection.query(query, [user0, user1], (err) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
};

const getBlockings = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const query = `
    WITH b AS (
      SELECT user1
      FROM Blocks
      WHERE user0=?
    )
    SELECT User.*
    FROM b JOIN User
    ON b.user1=User.userid;
  `;
  connection.query(query, [id], (err, rows) => {
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
    VALUES (?, ?);
  `;
  connection.query(query, [user0, user1], (err) => {
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
    WHERE user0=? AND user1=?;
  `;
  connection.query(query, [user0, user1], (err) => {
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
  const commentid = parseInt(req.params.commentid, 10);
  const query = `
    DELETE FROM Comment
    WHERE commentid=?;
  `;
  connection.query(query, [commentid], (err) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
};

const getHidesByPost = (req, res) => {
  const postid = parseInt(req.params.postid, 10);
  const query = `
    SELECT DISTINCT u.*
    FROM Hides h JOIN User u
      ON h.userid=u.userid
    WHERE h.postid=?;
  `;
  connection.query(query, [postid], (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
    }
  });
};

const getContactSuggestions = (req, res) => {
  const userid = parseInt(req.params.userid, 10);
  const query = `
    SELECT *
    FROM User
    WHERE userid NOT IN (
      SELECT user1
      FROM Follows
      WHERE user0=?
    ) AND userid NOT IN (
      SELECT user1
      FROM Blocks
      WHERE user0=?
    )
    ORDER BY RAND()
    LIMIT 5;
  `;
  connection.query(query, [userid, userid], (err, rows) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json(rows);
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
  getHidesByPost,
  getContactSuggestions,
};

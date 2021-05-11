const { v4 } = require('uuid');

const cors = require('cors');
const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const mysql = require('mysql');
const config = require('./db-config.js');

config.connectionLimit = 20;
const connection = mysql.createPool(config);

const projectId = 'cis577-final';
const keyFilename = 'cis577-final-bf53eebc8643.json';

const storage = new Storage({ projectId, keyFilename });
const bucketName = 'cis577-messages';
const upload = multer({ dest: 'uploads/' });

require('dotenv').config();
const routes = require('./routes.js');

const server = express();

/* eslint-disable no-use-before-define */
// if (server.get('env') === 'production') {
//   // Serve secure cookies, requires HTTPS
//   session.cookie.secure = true;
// }
/* eslint-enable no-use-before-define */

const port = process.env.PORT || '5001';

// Session Configuration object passed into express-session
const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  // forces the session to be saved back to the session store, even
  // if the application doesn't modify the session during the request.
  // For Auth0 Passport.js strategy, we need this to be false.
  resave: false,
  saveUninitialized: false,
};

server.use(cors());
server.options('*', cors());
server.use(express.json({ limit: '17mb' }));
server.use(express.static(path.join(__dirname, '../client/build')));

server.post('/api/user', routes.register);
server.post('/api/login', routes.login);
server.get('/api/user/:username', routes.getUser);
server.put('/api/user/:username/password', routes.resetPsw);
server.put('/api/user/:username/is_active', routes.changeUserActivation);
server.get('/api/users', routes.getUsers);

server.post('/api/post', routes.createPost);
server.get('/api/posts', routes.getPosts);
server.delete('/api/post/:postid', routes.deletePost);
server.post('/api/hide', routes.hidePost);
server.get('/api/feed/:userid', routes.getFeed);
server.get('/api/posts-by-user/:userid', routes.getPostsByUser);
server.post('/api/comment', routes.newComment);
server.delete('/api/comment/:commentid', routes.deleteComment);
server.get('/api/comments-by-post/:postid', routes.getCommentsByPost);
server.get('/api/following/:id', routes.getFollowings);
server.post('/api/follows', routes.addFollow);
server.delete('/api/follows', routes.deleteFollow);
server.get('/api/blocking/:id', routes.getBlockings);
server.post('/api/blocks', routes.addBlock);
server.delete('/api/blocks', routes.deleteBlock);
server.get('/api/messages/:username', routes.getMessages);
server.get('/api/sentMessages/:username', routes.getSentMessages);
server.post('/api/message', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
]), async (req, res) => {
  console.log('pinging');
  const {
    srcUser, dstUser, text,
  } = req.body;
  const files = JSON.parse(JSON.stringify(req.files));
  let asset = null;
  let type = 'text';
  let mediaUrl = null;
  if (files.video) {
    asset = files.video[0].path;
    type = 'video';
  } else if (files.audio) {
    asset = files.audio[0].path;
    type = 'audio';
  } else if (files.image) {
    asset = files.image[0].path;
    type = 'image';
  }
  if (asset) {
    const imageId = v4();
    await storage.bucket(bucketName).upload(asset, {
      destination: imageId,
    });
    mediaUrl = `https://storage.googleapis.com/cis577-messages/${imageId}`;
  }
  const query = `
    INSERT INTO Messages (srcUser, dstUser, text, mediaUrl, type)
    VALUES (?, ?, ?, ?, ?);
  `;
  connection.query(query, [srcUser, dstUser, text, mediaUrl, type], (err) => {
    if (err) {
      res.status(400).json({ status: 'err' });
      console.log(err);
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
});
// static route
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

server.listen(port, () => console.log(`server listening on port ${port}`));

/**
 * Passport Configuration
 */

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL,
  },
  /**
   * Access tokens are used to authorize users to an API
   * (resource server)
   * accessToken is the token to call the Auth0 API
   * or a secured third-party API
   * extraParams.id_token has the JSON Web Token
   * profile has all the information from the user
   */
  (accessToken, refreshToken, extraParams, profile, done) => done(null, profile),
);

/**
 * Server configuration for passport
 */
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug');
server.use(express.static(path.join(__dirname, 'public')));
server.use(expressSession(session));
passport.use(strategy);
server.use(passport.initialize());
server.use(passport.session());

// For sending and receiving values over the wire
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = server; // for testing

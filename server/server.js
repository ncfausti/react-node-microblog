const cors = require('cors');
const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
require('dotenv').config();
const { Twilio } = require('twilio');
const routes = require('./routes.js');
const authRouter = require('./auth');

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
server.get('/api/hide-by-post/:postid', routes.getHidesByPost);
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
server.get('/api/contact-suggestions/:userid', routes.getContactSuggestions);

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
 * Generate an Access Token for a chat application user - it generates a random
 * username for the client requesting a token, and takes a device ID as a query
 * parameter.
 */
server.get('/token', (request, response) => {
  const { identity } = request.query;

  const { AccessToken } = Twilio.jwt;
  const MAX_ALLOWED_SESSION_DURATION = 3600;
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { ttl: MAX_ALLOWED_SESSION_DURATION },
  );

  // Assign the generated identity to the token.
  token.identity = identity;

  const { VideoGrant } = AccessToken;
  const videoGrant = new VideoGrant();
  token.addGrant(videoGrant);

  const { ChatGrant } = AccessToken;

  const chatGrant = new ChatGrant({
    serviceSid: context.SERVICE_SID,
  });
  token.addGrant(chatGrant);

  const headers = {
    'Access-Control-Allow-Origin': '*', // change this to your client-side URL
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  response.setHeaders(headers);

  // Serialize the token to a JWT string.
  response.send(token.toJwt());
});

/**
 * Server/App configuration for passport
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

// custom middleware with Express
// Exposes request-level information, such as isAuthenticated
server.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Mount the authentication router to the root path
server.use('/', authRouter);

module.exports = server; // for testing

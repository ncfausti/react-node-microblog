const cors = require('cors');
const express = require('express');
const path = require('path');
const expressSession = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
require('dotenv').config();
const routes = require('./routes.js');

const server = express();

/* eslint-disable no-use-before-define */
if (server.get('env') === 'production') {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}
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
server.use(express.json());

server.get('/test', (req, res) => {
  res.send('connected');
});

server.post('/user', routes.register);
server.post('/login', routes.login);
server.get('/dbtest', routes.dbTest);
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

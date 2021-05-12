/* eslint-disable no-undef */
const supertest = require('supertest');
const http = require('http');
const webapp = require('../server');

let server;
let request;

beforeAll((done) => {
  server = http.createServer(webapp);
  server.listen(done);
  request = supertest(server);
});

afterAll((done) => {
  server.close(done);
});

const testUser = {
  userid: 26,
  username: 'test',
  password: 'test',
  nickname: 'testing_account',
  email: 'test@test.com',
  phone: null,
  avatar_ref: null,
  summary: null,
  registration_date: '2021-04-11 15:52:23',
  is_active: 0,
};

describe('Test /register endpoint', () => {
  it('/register endpoint conflict username 409', () => request.post('/api/user').send({ username: 'test', password: 'test' }).expect(409));
  it('/register endpoint empty username 400', () => request.post('/api/user').send({ username: '', password: 'test' }).expect(400));
  it('/register endpoint too long username 400', () => request.post('/api/user').send({ username: 'abcdefghabcdefghabcdefghabcdefgh', password: 'test' }).expect(400));
});

describe('Test /login endpoint', () => {
  it('/login endpoint test works', () => request.post('/api/login').send({ username: 'test', password: 'test' }).expect(200));

  it('/login endpoint incorrect credentials 400', () => request.post('/api/login').send({ username: 'test', password: 'foo' }).expect(400));
});

describe('Test User model endpoints', () => {
  it('Get user by name', () => request.get('/api/user/test')
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text)).toStrictEqual(testUser);
    }));

  it('Get contact suggestion', () => request.get('/api/contact-suggestions/31')
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text)).toHaveLength(5);
    }));

  it('Get all users', () => request.get('/api/users')
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).length).toBeGreaterThan(10);
    }));
});

describe('Test Post & Comment model endpoints', () => {
  it('Get posts on first page', () => request.get('/api/posts')
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).length).toStrictEqual(5);
    }));

  it('Get posts owned by a user', () => request.get('/api/posts-by-user/55')
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).length).toStrictEqual(5);
    }));

  it('Get feed for a user', () => request.get('/api/feed/31')
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).length).toStrictEqual(5);
    }));

  it('Get comments for a post', () => request.get('/api/comments-by-post/5')
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).length).toStrictEqual(2);
    }));
});

describe('Test hide, follow, block', () => {
  it('Get following for a user', () => request.get('/api/following/31')
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).length).toStrictEqual(4);
    }));

  it('Get hide for a post', () => request.get('/api/hide-by-post/5')
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).length).toStrictEqual(1);
    }));

  it('Get blocking for a user', () => request.get('/api/blocking/31')
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).length).toStrictEqual(1);
    }));
});

describe('Test messaging', () => {
  it('get messages', () => request.get('/api/messages/feng3116')
    .expect(200)
    .then((response) => {
      console.log(response);
      expect(response.length > 0);
    }));
  it('see message', () => request.put('/api/seeMessage/26')
    .expect(200));
});

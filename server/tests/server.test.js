/* eslint-disable no-undef */
const supertest = require('supertest');
const http = require('http');
const webapp = require('../server');

describe('Test  /register endpoint', () => {
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
  it('/register endpoint test works', () => request.post('/user').send({ username: 'test', password: 'test' }).expect(201));

  it('/register endpoint malformed registration 400', () => request.post('/user').send({ username: 'nottest', password: 'test' }).expect(400));
});

describe('Test /login endpoint', () => {
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
  it('/login endpoint test works', () => request.post('/login').send({ username: 'test', password: 'test' }).expect(201));

  it('/login endpoint incorrect credentials 400', () => request.post('/login').send({ username: 'nottest', password: 'test' }).expect(400));
});

import webapp from '../server';
import supertest from 'supertest';
import http from 'http';

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
    it('/register endpoint test works', () => {
        return request.post('/user').send({'username':'test','password':'test'}).expect(201)
    });

    it('/register endpoint malformed registration 400', () => {
        return request.post('/user').send({'username':'nottest','password':'test'}).expect(400)
    });
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
    it('/login endpoint test works', () => {
        return request.post('/login').send({'username':'test','password':'test'}).expect(201)
    });

    it('/login endpoint incorrect credentials 400', () => {
        return request.post('/login').send({'username':'nottest','password':'test'}).expect(400)
    });
});
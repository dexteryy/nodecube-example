/* eslint max-nested-callbacks: 0 */

// import { expect } from 'chai';
import request from 'supertest';
import app from '../../../server';
import connectServices from '../../utils/connectServices';

describe('auth', function () {

  const USERNAME = `user4test${Date.now()}`;
  const EMAIL = `user4test${Date.now()}@company.com`;
  const EMAIL2 = `user4test${Date.now()}@persona.com`;
  const PASSWORD = 'B33eE+An';

  before(function (done) {
    Promise.all(Object.values(connectServices)).then(() => {
      done();
    });
  });

  it('/api/signup', function (done) {
    request(app)
      .post('/api/signup')
      .set('Accept', 'application/json')
      .send({
        email: EMAIL2,
        password: PASSWORD,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        const body = res.body;
        if (body.status) {
          return done(new Error(body.message));
        }
        if (body.email !== EMAIL2) {
          return done(new Error('WRONG EMAIL'));
        }
        if (!body.username) {
          return done(new Error('WRONG USERNAME'));
        }
        return done();
      }).catch(done);
  });

  it('/api/signup (custom username)', function (done) {
    request(app)
      .post('/api/signup')
      .set('Accept', 'application/json')
      .send({
        username: USERNAME,
        email: EMAIL,
        password: PASSWORD,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        const body = res.body;
        if (body.status) {
          return done(new Error(body.message));
        }
        if (body.email !== EMAIL) {
          return done(new Error('WRONG EMAIL'));
        }
        if (body.username !== USERNAME) {
          return done(new Error('WRONG USERNAME'));
        }
        return done();
      }).catch(done);
  });

  describe('after sign up...', function () {

    let token, token2;

    it('/api/signup - email exist', function (done) {
      request(app)
        .post('/api/signup')
        .set('Accept', 'application/json')
        .send({
          email: EMAIL,
          password: PASSWORD,
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          const body = res.body;
          if (body.status !== -4) {
            return done(new Error('EMAIL EXIST ERROR'));
          }
          return done();
        }).catch(done);
    });

    it('/api/signup - username exist', function (done) {
      request(app)
        .post('/api/signup')
        .set('Accept', 'application/json')
        .send({
          email: `prefix_${EMAIL}`,
          username: USERNAME,
          password: PASSWORD,
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          const body = res.body;
          if (body.status !== -1) {
            return done(new Error('USERNAME EXIST ERROR'));
          }
          return done();
        }).catch(done);
    });

    it('/api/signin (with email)', function (done) {
      request(app)
        .post('/api/signin')
        .set('Accept', 'application/json')
        .send({
          id: EMAIL2,
          password: PASSWORD,
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          const body = res.body;
          if (body.status) {
            return done(new Error(body.message));
          }
          if (!body.token) {
            return done(new Error('NO TOKEN'));
          }
          token2 = body.token;
          return done();
        }).catch(done);
    });

    it('/api/signin (with username)', function (done) {
      request(app)
        .post('/api/signin')
        .set('Accept', 'application/json')
        .send({
          id: USERNAME,
          password: PASSWORD,
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          const body = res.body;
          if (body.status) {
            return done(new Error(body.message));
          }
          if (!body.token) {
            return done(new Error('NO TOKEN'));
          }
          token = body.token;
          return done();
        }).catch(done);
    });

    it('/api/signin - Wrong email', function (done) {
      request(app)
        .post('/api/signin')
        .set('Accept', 'application/json')
        .send({
          id: 'user4test00000@gmail.com',
          password: PASSWORD,
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          const body = res.body;
          if (body.status !== -2) {
            return done(new Error('NO WRONG USERNAME ERROR'));
          }
          return done();
        }).catch(done);
    });

    it('/api/signin - Wrong username', function (done) {
      request(app)
        .post('/api/signin')
        .set('Accept', 'application/json')
        .send({
          id: 'user4test00000',
          password: PASSWORD,
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          const body = res.body;
          if (body.status !== -2) {
            return done(new Error('NO WRONG USERNAME ERROR'));
          }
          return done();
        }).catch(done);
    });

    it('/api/signin - Wrong password', function (done) {
      request(app)
        .post('/api/signin')
        .set('Accept', 'application/json')
        .send({
          id: USERNAME,
          password: `${PASSWORD}1`,
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          const body = res.body;
          if (body.status !== -1) {
            return done(new Error('NO WRONG PASSWORD ERROR'));
          }
          return done();
        }).catch(done);
    });

    describe('after sign in...', function () {

      it('/api/account', function (done) {
        request(app)
          .get('/api/account')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token2}`)
          .expect(200)
          .then(res => {
            const body = res.body;
            if (body.email !== EMAIL2) {
              return done(new Error('WRONG USER'));
            }
            return done();
          }).catch(done);
      });

      it('/api/account', function (done) {
        request(app)
          .get('/api/account')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(res => {
            const body = res.body;
            if (body.username !== USERNAME
                || body.email !== EMAIL) {
              return done(new Error('WRONG USER'));
            }
            return done();
          }).catch(done);
      });

      it('/api/account - Unauthorized', function (done) {
        request(app)
          .get('/api/account')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer fdsafsdafwefewf')
          .expect(401, done);
      });

    });

  });

});

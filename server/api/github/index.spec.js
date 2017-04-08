/* eslint max-nested-callbacks: 0 */

import request from 'supertest';
import app from '../../../server';
import nock from 'nock';
import jsonfile from 'jsonfile';

describe('github', function () {

  beforeEach(function () {
    nock('https://api.github.com')
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/users/dexteryy/orgs')
      .reply(200, function () {
        return jsonfile.readFileSync('./server/api/github/mock/orgs.json');
      });
    nock('https://api.github.com')
      .defaultReplyHeaders({
        'X-Powered-By': 'nock',
      })
      .get('/users/dexteryy/repos')
      .reply(200, function () {
        return jsonfile.readFileSync('./server/api/github/mock/repos.json');
      });
  });

  it('/api/github/users/:username', function (done) {
    request(app)
      .get('/api/github/users/dexteryy')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        const body = res.body;
        if (body.status) {
          return done(new Error(body.message));
        }
        if (!body.data) {
          return done(new Error('NO DATA'));
        }
        const {
          orgs,
          repos,
        } = body.data;
        if (orgs.length < 1) {
          return done(new Error('WRONG orgs'));
        }
        if (repos.length < 1) {
          return done(new Error('WRONG orgs'));
        }
        return done();
      }).catch(done);
  });

});

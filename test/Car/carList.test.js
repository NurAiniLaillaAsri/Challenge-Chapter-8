const request = require('supertest');
const app = require('../../app');

describe('Cars', () => {
  it('Get all car list', () => {
    return request(app)
      .get('/v1/cars')
      .set('Accept', 'application/json')
      .expect(200);
  });
});
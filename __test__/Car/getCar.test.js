const request = require('supertest');
const app = require('../../app');

describe('Cars', () => {
  it('Get car', () => {
    return request(app)
      .get('/v1/cars')
      .set('Accept', 'application/json')
      .expect(200);
  });
});

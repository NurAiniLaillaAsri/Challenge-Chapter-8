const request = require('supertest');
const app = require('../../../app');
const { User } = require('../../../app/models');

describe('User', () => {
  afterAll(async () => {
    await User.destroy({ where: { email: 'lailla@gmail.com' } });
  });

  it('Register user', () => request(app)
    .post('/v1/auth/register')
    .set('Accept', 'application/json')
    .send({
      name: 'lailla',
      email: 'lailla@gmail.com',
      password: 'lailla',
    })
    .then((res) => {
      expect(res.statusCode).toBe(201);
      expect(res.body.accessToken).toEqual(res.body.accessToken);
    }));

  it('Register with excisting mail', () => request(app)
    .post('/v1/auth/register')
    .set('Accept', 'application/json')
    .send({
      name: 'la',
      email: 'lailla@gmail.com',
      password: 'la',
    })
    .then((res) => {
      expect(res.statusCode).toBe(422);
      expect(res.body.accessToken).toEqual(res.body.accessToken);
    }));

  it('should return status code 500', () => request(app)
    .post('/v1/auth/register')
    .set('Accept', 'application/json')
    .send({})
    .then((res) => {
      expect(res.statusCode).toBe(500);
      console.log(res.body);
    }));
});

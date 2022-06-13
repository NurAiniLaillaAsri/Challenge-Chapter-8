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
    .expect(201));

  it('Register with excisting mail', () => request(app)
    .post('/v1/auth/register')
    .set('Accept', 'application/json')
    .send({
      name: 'la',
      email: 'lailla@gmail.com',
      password: 'la',
    })
    .expect(422));
});

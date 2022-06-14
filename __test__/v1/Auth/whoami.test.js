const request = require('supertest');
const app = require('../../../app');
const { User } = require('../../../app/models');

describe('GET /v1/auth/whoami', () => {
  beforeAll(async () => {
    const loginAdm = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: 'admin',
      });
    tokenAdmin = loginAdm.body.accessToken;

    const loginCust = await request(app)
      .post('/v1/auth/register')
      .send({
        name: 'lailla',
        email: 'lailla@binar.co.id',
        password: '123456',
      });
    tokenCustomer = loginCust.body.accessToken;
  });

  afterAll(async () => {
    await User.destroy({ where: { email: 'lailla@binar.co.id' } });
    await User.destroy({ where: { email: 'nala@binar.co.id' } });
  });

  it('should response with 401 as status code (admin)', async () => request(app)
    .get('/v1/auth/whoami')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .then((res) => {
      // console.log(res.statusCode)
      // console.log(res.body);
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        error: {
          name: 'Error',
          message: 'Access forbidden!',
          details: {
            role: 'ADMIN',
            reason: 'ADMIN is not allowed to perform this operation.',
          },
        },
      });
    }));

  it('should response with 200 as status code (customer)', async () => request(app)
    .get('/v1/auth/whoami')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${tokenCustomer}`)
    .then((res) => {
      // console.log(res.statusCode)
      // console.log(res.body);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        image: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    }));
});

describe('GET /v1/auth/whoami (not an user)', () => {
  beforeEach(async () => {
    await User.destroy({ where: { email: 'lailla@binar.co.id' } });
  });

  it('should response with 404 as status code (not an user)', async () => request(app)
    .get('/v1/auth/whoami')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${tokenCustomer}`)
    .then((res) => {
      // console.log(res.statusCode)
      // console.log(res.body);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        error: {
          name: 'User',
          message: 'User not found!',
          details: { name: 'User' },
        },
      });
    }));
});

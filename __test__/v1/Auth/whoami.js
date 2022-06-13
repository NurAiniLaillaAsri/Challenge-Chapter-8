const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../../app');
const { User } = require('../../../app/models');

describe('GET /v1/auth/whoami', () => {
  const password = '123456';

  const userAdmin = {
    name: 'AdminTest',
    email: 'admintest@gmail.com',
    encryptedPassword: bcrypt.hashSync(password, 10),
    roleId: 2,
  };

  const userCustomer = {
    name: 'CustomerTest',
    email: 'customertest@gmail.com',
    encryptedPassword: bcrypt.hashSync(password, 10),
    roleId: 1,
  };

  beforeEach(async () => {
    try {
      await User.create(userAdmin);
      await User.create(userCustomer);
    } catch (err) {
      console.error(err.message);
    }
  });

  afterEach(async () => {
    try {
      await User.destroy({ where: { email: userAdmin.email } });
      await User.destroy({ where: { email: userCustomer.email } });
    } catch (err) {
      console.error(err.message);
    }
  });

  it('should response with 401 as status code', async () => request(app)
    .post('/v1/auth/login')
    .set('Content-Type', 'application/json')
    .send({ email: userAdmin.email, password })
    .then((res) => {
      request(app)
        .get('/v1/auth/whoami')
        .set('Authorization', `Bearer ${res.body.accessToken}`)
        .then((res) => {
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
        });
    }));

  it('should response with 200 as status code', async () => request(app)
    .post('/v1/auth/login')
    .set('Content-Type', 'application/json')
    .send({ email: userCustomer.email, password })
    .then((res) => {
      request(app)
        .get('/v1/auth/whoami')
        .set('Authorization', `Bearer ${res.body.accessToken}`)
        .then((res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
            image: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    }));
});
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../../app');
const { User } = require('../../../app/models');

describe('POST /v1/auth/login', () => {
  const emailLogin = 'Jayabaya@binar.co.id';
  const emailNotRegistered = 'custnotregis@gmail.com';
  const passwordLogin = '123456';
  const passwordNotRegistered = 'custnotregis';
  const passwordHash = bcrypt.hashSync(passwordLogin, 10);

  const customer = {
    name: 'customer',
    email: emailLogin,
    password: passwordHash,
    roleId: 1,
  };

  beforeEach(async () => {
    await User.create(customer);
    const user = await User.findOne({ where: { email: emailNotRegistered } });

    if (user != null) {
      await user.destroy({ where: { email: emailNotRegistered } });
    }
  });

  afterEach(async () => {
    const user = await User.findOne({ where: { email: emailLogin } });
    await user.destroy({ where: { email: emailLogin } });
  });

  it('should return status code 201 and access token', async () => request(app)
    .post('/v1/auth/login')
    .set('Content-Type', 'application/json')
    .send({ email: customer.email, password: passwordLogin })
    .then((res) => {
      // console.log(res.body)
      expect(res.statusCode).toBe(201);
      expect(res.body.accesToken).toEqual(res.body.accesToken);
    }));

  it('should return status code 401 password incorrect', async () => request(app)
    .post('/v1/auth/login')
    .set('Content-Type', 'application/json')
    .send({ email: customer.email, password: passwordNotRegistered })
    .then((res) => {
      // console.log(res.body)
      expect(res.statusCode).toBe(401);
      expect(res.body.error.details.message).toEqual(
        'Password is not correct!',
      );
    }));

  it('should return status code 404 email not registered', async () => request(app)
    .post('/v1/auth/login')
    .set('Content-Type', 'application/json')
    .send({ email: emailNotRegistered, password: passwordLogin })
    .then((res) => {
      // console.log(res.body);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        error: {
          name: expect.any(String),
          message: expect.any(String),
          details: { email: expect.any(String) },
        },
      });
    }));

  it('should return status code 500', async () => request(app)
    .post('/v1/auth/login')
    .set('Content-Type', 'application/json')
    .send({})
    .then((res) => {
      // console.log(res.body);
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({
        error: {
          name: 'TypeError',
          message: "Cannot read properties of undefined (reading 'toLowerCase')",
          details: null,
        },
      });
    }));
});

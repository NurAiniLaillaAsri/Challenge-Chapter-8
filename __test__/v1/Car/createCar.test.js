const request = require('supertest');
const app = require('../../../app');
const { Car } = require('../../../app/models');


describe('POST /v1/create', () => {
  let accessToken;

  beforeAll(async () => {
    const login = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: 'admin',
      });
    accessToken = login.body.accessToken;
  })

  afterAll(async () => {
    await Car.destroy({ where: { name: 'Ayla Test' } });
  })

  it('should response with 201 as status code', async () => {
    return request(app)
      .post('/v1/cars')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Ayla Test',
        price: 100000,
        image: 'https://source.unsplash.com/500x500',
        size: 'SMALL',
      })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
          size: expect.any(String),
          image: expect.any(String),
          isCurrentlyRented: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      })
  });

  it('should response with 422 as status code', async () => {
    return request(app)
      .post('/v1/cars')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: '',
        price: '',
        image: '',
        size: '',
      })
      .then((res) => {
        // console.log(res)
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual({
          error: {
            name: expect.any(String),
            message: expect.any(String),
          },
        })
      })
  });
})


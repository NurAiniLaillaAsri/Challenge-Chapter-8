const dayjs = require('dayjs');
const request = require('supertest');
const app = require('../../../../app');
const { Car } = require('../../../../app/models');

describe('POST /v1/cars/:id', () => {
  let tokenAdmin;
  let carRent;

  beforeAll(async () => {
    const loginAdm = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: 'admin',
      });
    tokenAdmin = loginAdm.body.accessToken;

    carRent = await request(app)
      .post('/v1/cars')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        name: 'Ayla Delete',
        price: 100000,
        image: 'https://source.unsplash.com/500x500',
        size: 'SMALL',
      });
  });

  it('should response with 200 as status code (delete car succes)', async () => request(app)
    .delete(`/v1/cars/${carRent.body.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .then((res) => {
      console.log(res.statusCode)
      console.log(res.body)
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: `Succesfully delete car id ${carRent.body.id}`
      })
    })
  );
})
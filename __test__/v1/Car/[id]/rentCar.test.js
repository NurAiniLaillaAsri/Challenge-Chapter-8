const dayjs = require('dayjs');
const request = require('supertest');
const app = require('../../../../app');
const { Car } = require('../../../../app/models');

dayjs().format();

describe('POST /v1/cars/:id/rent', () => {
  let tokenCustomer;
  let tokenAdmin;
  let rentStartedAt = dayjs().add(1, 'day');
  let rentEndedAt = dayjs(rentStartedAt).add(1, 'day');

  beforeAll(async () => {
    const loginCust = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'fikri@binar.co.id',
        password: '123456',
      });
    tokenCustomer = loginCust.body.accessToken;

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
        name: 'Ayla Rent',
        price: 100000,
        image: 'https://source.unsplash.com/500x500',
        size: 'SMALL',
      });
  });

  // afterAll(async () => {
  //   await Car.destroy({ where: { name: 'Ayla Rent' } });
  // })

  it('should response with 201 as status code (rent car succes)', async () => request(app)
    .post(`/v1/cars/${carRent.body.id}/rent`)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${tokenCustomer}`)
    .send({ rentStartedAt })
    .then((res) => {
      // console.log(res.statusCode)
      // console.log(res.body)
      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(Number),
        carId: expect.any(Number),
        userId: expect.any(Number),
        rentStartedAt: expect.any(String),
        rentEndedAt: expect.any(String),
      })
    })
  );

  it('should response with 422 as status code (activeRent)', async () => request(app)
    .post(`/v1/cars/${carRent.body.id}/rent`)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${tokenCustomer}`)
    .send({ rentStartedAt, rentEndedAt })
    .then((res) => {
      // console.log(res.statusCode)
      // console.log(res.body)
      expect(res.statusCode).toBe(422);
      expect(res.body).toMatchObject({
        error: {
          name: expect.any(String),
          message: expect.any(String),
          details: {
            car: expect.any(Object),
          }
        }
      });
    })
  );
})
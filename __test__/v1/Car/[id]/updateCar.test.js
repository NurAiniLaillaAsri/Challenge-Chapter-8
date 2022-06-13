const request = require('supertest');
const app = require('../../../../app');
const { Car } = require('../../../../app/models');

describe('POST /v1/cars/:id', () => {
  let accessToken;
  let car;

  beforeAll(async () => {
    const login = await request(app)
      .post('/v1/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: 'admin',
      });
    accessToken = login.body.accessToken;

    car = await Car.create({
      name: 'Ayla before update',
      price: 100000,
      image: 'https://source.unsplash.com/500x500',
      size: 'SMALL',
      isCurrentlyRented: false,
    });
    return car;
  });

  afterAll(async () => { car.destroy(); });

  it('should response with 201 as status code (Update Car)', async () =>
    // console.log(car.id)
    request(app)
      .put(`/v1/cars/${car.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Ayla Updated',
        price: 100000,
        image: 'https://source.unsplash.com/500x500',
        size: 'SMALL',
        isCurrentlyRented: false,
      })
      .then((res) => {
        // console.log(res.statusCode)
        // console.log(res.body)
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
          message: 'Data have been updated successfully',
          // data: {
          //   id: expect.any(Number),
          //   name: expect.any(String),
          //   price: expect.any(Number),
          //   size: expect.any(String),
          //   image: expect.any(String),
          //   isCurrentlyRented: expect.any(Boolean),
          //   updatedAt: expect.any(String),
          //   createdAt: expect.any(String),
          // },
        });
      }));

  it('should response with 422 as status code (No id)', async () => request(app)
    .put('/v1/cars/-999999999999999')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      // name: 'Ayla Updated',
      // price: 100000,
      // image: 'https://source.unsplash.com/500x500',
      // size: 'SMALL',
      // isCurrentlyRented: false,

    })
    .then((res) => {
      // console.log(res.statusCode);
      // console.log(res.body);
      expect(res.statusCode).toBe(422);
      expect(res.body).toEqual({
        error: {
          name: expect.any(String),
          message: expect.any(String),
        },
      });
    }));
});

const request = require('supertest');
const app = require('../../../../app');
const { Car } = require('../../../../app/models');

let car;
describe('GET /v1/cars/:id', () => {
  beforeAll(async () => {
    car = await Car.create({
      name: 'Ayla getCar',
      price: 10000,
      size: 'SMALL',
      image: 'https://source.unsplash.com/500x500',
      isCurrentlyRented: false,
    });
    return car;
  });

  afterAll(() => car.destroy());

  it('Get car', () => request(app)
    .get(`/v1/cars/${car.id}`)
    .set('Accept', 'application/json')
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.any(Number),
        size: expect.any(String),
        image: expect.any(String),
        isCurrentlyRented: expect.any(Boolean),
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
      });
    }));
});

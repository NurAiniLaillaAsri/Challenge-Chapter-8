const request = require('supertest');
const app = require('../../../app');

describe('Cars', () => {
  it('Get all car list', () => request(app)
    .get('/v1/cars')
    .then((res) => {
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          cars: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              price: expect.any(Number),
              size: expect.any(String),
              image: expect.any(String),
              isCurrentlyRented: expect.any(Boolean),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
        }),
      );
    }));
});

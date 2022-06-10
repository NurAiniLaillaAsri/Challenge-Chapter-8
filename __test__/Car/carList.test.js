const request = require('supertest');
const app = require('../../app');

describe('Cars', () => {
  it('Get all car list', () => {
    return request(app)
      .get('/v1/cars')
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            cars: expect.arrayContaining([expect.any(Object)]),
            meta: expect.objectContaining({
              pagination: expect.any(Object),
            }),
          })
        );
      });

  });
});
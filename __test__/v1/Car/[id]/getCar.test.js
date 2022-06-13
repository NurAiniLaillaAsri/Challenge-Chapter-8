const request = require('supertest');
const app = require('../../../../app');

describe('GET /v1/cars/:id', () => {
  it('Get car', async () => {
    const id = 1;

    return await request(app)
      .get(`/v1/cars/${id}`)
      .set('Accept', 'application/json')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(response.body);
      });
  });
});

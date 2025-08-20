const request = require('supertest');
const app = require('../server');

describe('Health Check', () => {
  it('should return {ok: true}', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body).toEqual({ ok: true });
  });
}); 
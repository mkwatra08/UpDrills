const request = require('supertest');
const app = require('../server');

describe('Drills Cache Performance', () => {
  describe('GET /api/drills', () => {
    it('should return drills with ETag header', async () => {
      const response = await request(app)
        .get('/api/drills')
        .expect(200);

      expect(response.body).toHaveProperty('drills');
      expect(Array.isArray(response.body.drills)).toBe(true);
      
      // Check for ETag header (caching support)
      expect(response.headers).toHaveProperty('etag');
    });

    it('should return 304 for cached requests', async () => {
      // First request
      const response1 = await request(app)
        .get('/api/drills')
        .expect(200);

      const etag = response1.headers.etag;

      // Second request with ETag
      const response2 = await request(app)
        .get('/api/drills')
        .set('If-None-Match', etag)
        .expect(304);
    });

    it('should handle filtering parameters', async () => {
      const response = await request(app)
        .get('/api/drills?difficulty=easy')
        .expect(200);

      expect(response.body).toHaveProperty('drills');
      expect(Array.isArray(response.body.drills)).toBe(true);
    });
  });
}); 
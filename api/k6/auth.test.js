const request = require('supertest');
const app = require('../server');

describe('Authentication Endpoints', () => {
  describe('GET /auth/config', () => {
    it('should return OAuth configuration status', async () => {
      const response = await request(app)
        .get('/auth/config')
        .expect(200);

      expect(response.body).toHaveProperty('oauthConfigured');
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.oauthConfigured).toBe('boolean');
    });
  });

  describe('GET /api/me', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/me')
        .expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('GET /auth/logout', () => {
    it('should handle logout request', async () => {
      const response = await request(app)
        .get('/auth/logout')
        .expect(200);

      expect(response.body.message).toBe('Logged out successfully');
    });
  });
}); 
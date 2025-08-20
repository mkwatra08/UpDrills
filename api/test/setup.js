// Test setup file
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://localhost:27017/updrill-test';
process.env.JWT_SECRET = 'test-secret';
process.env.SESSION_COOKIE_NAME = 'test_sid';
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
process.env.GOOGLE_CALLBACK_URL = 'http://localhost:4000/auth/google/callback'; 
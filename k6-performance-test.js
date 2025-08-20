import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 users
    { duration: '1m', target: 10 },  // Stay at 10 users
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<150'], // 95% of requests must complete below 150ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests can fail
  },
};

const BASE_URL = 'http://localhost:4000';

export default function () {
  // Test the cached drills endpoint
  const response = http.get(`${BASE_URL}/api/drills`);
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 150ms': (r) => r.timings.duration < 150,
    'has drills data': (r) => r.json('drills') && r.json('drills').length > 0,
  });

  sleep(1);
} 
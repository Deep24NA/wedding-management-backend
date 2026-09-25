import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import type { Server } from 'node:http';
import app from '../../src/app.js';

describe('Express Security Integration Tests', () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        if (address && typeof address === 'object') {
          baseUrl = `http://127.0.0.1:${address.port}`;
        }
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  test('GET /health returns 200 OK and healthy status', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data.status, 'UP');
  });

  test('Security Headers: Helmet headers are present and X-Powered-By is hidden', async () => {
    const res = await fetch(`${baseUrl}/health`);

    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('x-frame-options'), 'DENY');
    assert.equal(res.headers.get('x-download-options'), 'noopen');
    assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
    assert.equal(res.headers.get('x-powered-by'), null);
  });

  test('CORS: Allowed origin receives CORS headers and credentials', async () => {
    const res = await fetch(`${baseUrl}/health`, {
      headers: {
        Origin: 'http://localhost:3000',
      },
    });

    assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:3000');
    assert.equal(res.headers.get('access-control-allow-credentials'), 'true');
  });

  test('CORS: Preflight OPTIONS request returns 204 No Content', async () => {
    const res = await fetch(`${baseUrl}/health`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
      },
    });

    assert.equal(res.status, 204);
    assert.ok(res.headers.get('access-control-allow-methods'));
  });

  test('CORS: Unauthorized origin receives 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/health`, {
      headers: {
        Origin: 'http://unauthorized-domain.com',
      },
    });

    assert.equal(res.status, 403);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /CORS/);
  });

  test('HTTP Methods: Disallowed method TRACE returns 405 Method Not Allowed', async () => {
    const url = new URL(`${baseUrl}/health`);
    const status = await new Promise<number>((resolve, reject) => {
      const req = http.request(
        {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname,
          method: 'TRACE',
        },
        (res) => {
          resolve(res.statusCode || 0);
        },
      );
      req.on('error', reject);
      req.end();
    });

    assert.equal(status, 405);
  });

  test('Body Limits: Rejects JSON payloads exceeding size limit with 413 Payload Too Large', async () => {
    // 10kb limit; generate a payload greater than 10kb
    const largePayload = {
      data: 'x'.repeat(12 * 1024),
    };

    const res = await fetch(`${baseUrl}/health`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(largePayload),
    });

    assert.equal(res.status, 413);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /Payload too large/);
  });

  test('Error Handling: Malformed JSON body returns 400 Bad Request', async () => {
    const res = await fetch(`${baseUrl}/health`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{"invalidJson": ',
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /Malformed JSON/);
  });

  test('Not Found: Unmatched route returns 404 with structured error', async () => {
    const res = await fetch(`${baseUrl}/api/v1/non-existent-endpoint`);

    assert.equal(res.status, 404);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.message, /Route not found/);
  });

  test('Rate Limiting: Non-health endpoint contains standard RateLimit headers', async () => {
    const res = await fetch(`${baseUrl}/api/v1/non-existent-endpoint`);
    assert.ok(res.headers.has('ratelimit-limit'));
    assert.ok(res.headers.has('ratelimit-remaining'));
    assert.ok(res.headers.has('ratelimit-reset'));
  });

  test('Rate Limiting: Health endpoint skips global rate limiter', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.headers.has('ratelimit-limit'), false);
  });
});

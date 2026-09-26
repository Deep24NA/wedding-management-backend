# ADR 0002: Express Server Initialization and Timeouts

## Status

Accepted

## Context

The application had two server initialization paths in `src/server.ts` (`app.listen` and `server.listen`). Using Express's `app.listen()` bypasses explicit Node.js HTTP server timeout configurations (keep-alive, headers, and request timeouts) which are critical for production security (e.g., mitigating Slowloris attacks).

## Decision

The Express application must exclusively be started by passing it to Node's `http.createServer(app)`, and then calling `listen()` on the resulting `server` instance. The raw `app.listen()` method is prohibited.

## Consequences

- Production timeouts (`keepAliveTimeout`, `headersTimeout`, `requestTimeout`) are reliably enforced.
- Prevents race conditions from binding to the same port multiple times.

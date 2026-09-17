import app from "./app";
import http from 'node:http';
import app from './app.js';
import { env } from './config/env.js';

const PORT = 3000;
const server = http.createServer(app);

app.listen(PORT , () => {
    console.log(`Server is running in ${PORT}`)
})
/**
 * Production HTTP Server Timeouts Configuration
 *
 * - keepAliveTimeout: 61000ms (61s). Configured slightly higher than common upstream reverse
 *   proxies and cloud load balancers (typically 60s) to prevent race-condition connection resets.
 * - headersTimeout: 65000ms (65s). Must be greater than keepAliveTimeout in Node.js to protect
 *   against Slowloris-style header attacks.
 * - requestTimeout: 30000ms (30s). Protects server worker resources from hung requests.
 */
server.keepAliveTimeout = 61000;
server.headersTimeout = 65000;
server.requestTimeout = 30000;

server.listen(env.PORT, () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

// Graceful shutdown handling
const handleShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down HTTP server...`);
  server.close((err) => {
    if (err) {
      console.error('Error during HTTP server shutdown:', err);
      process.exit(1);
    }
    console.log('HTTP server closed successfully.');
    process.exit(0);
  });

  // Force close after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    console.error('Forceful shutdown after timeout.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection at:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception thrown:', error);
  handleShutdown('UNCAUGHT_EXCEPTION');
});
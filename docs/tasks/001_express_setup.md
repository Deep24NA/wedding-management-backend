# Task: Configure Express Application with Production-Grade Security

## Objective

Configure the existing Wedding Management Backend Express application with a strong, production-ready security foundation.

This task is **only for the Express/application security layer**. Do not implement business modules, authentication/authorization flows, database models, or unrelated features.

The implementation must follow the project's existing architecture, conventions, rules, and dependency strategy.

---

## Mandatory Workflow

Before changing any code, follow this workflow:

1. **Understand / Explore**

   * Read `.ai/AGENTS.md` first.
   * Read the relevant files under `.ai/rules/`.
   * Read `.ai/AI_context.md` if available.
   * Inspect the existing project structure.
   * Inspect the current Express entry point/app configuration.
   * Inspect `package.json`, TypeScript configuration, environment configuration, existing middleware, error handling, and constants.
   * Determine which security mechanisms already exist.
   * Do not assume the project is empty or create duplicate architecture.

2. **Implementation Plan**

   * Create an implementation plan in Markdown before modifying the project.
   * Clearly list:

     * Current state
     * Security requirements
     * Files to create/change
     * Dependencies required
     * Middleware order
     * Configuration/environment variables
     * Validation strategy
     * Potential compatibility concerns

3. **Wait for Approval**

   * Do not implement until the plan is reviewed and approved.

4. **Implement**

   * Implement only the approved plan.
   * Follow existing architecture and naming conventions.
   * Avoid unnecessary dependencies.

5. **Validate**

   * Run formatting, type checking, linting, tests, and relevant application checks.
   * Verify security middleware actually executes in the intended order.

6. **Final Review**

   * Review the complete diff.
   * Check for accidental unrelated changes.
   * Check for security misconfiguration.
   * Check for exposed secrets or sensitive information.

7. **Report**

   * Report changed files.
   * Report dependencies added/removed.
   * Report commands executed.
   * Report successful checks.
   * Report failures and remaining limitations.

---

# Security Scope

Configure the Express application with the following security baseline where applicable.

## 1. Helmet

Add and configure `helmet` for secure HTTP response headers.

Review and configure appropriate protections including:

* Content Security Policy
* X-Content-Type-Options
* Referrer Policy
* Strict-Transport-Security
* Frame protection
* DNS prefetch control
* Cross-origin related protections

Do not blindly enable a restrictive CSP that breaks the API.

Since this is primarily a REST API, design the configuration around API usage rather than browser-rendered HTML.

If CSP is unnecessary for the API architecture, document that decision rather than adding an arbitrary policy.

---

## 2. CORS

Configure CORS centrally.

Requirements:

* Never use unrestricted `origin: "*"` when credentials/authenticated requests are involved.
* Support configurable frontend origins through environment variables.
* Support multiple allowed origins if required.
* Properly handle:

  * allowed origins
  * methods
  * headers
  * credentials
  * preflight requests
* Reject unauthorized origins appropriately.
* Do not hardcode development machine URLs into production configuration.

Example environment concept:

```env
CORS_ORIGINS=http://localhost:3000
```

The exact environment variable name must follow the project's existing configuration conventions.

---

## 3. HTTP Request Limits

Configure safe request limits.

Review and configure:

* JSON body size
* URL-encoded body size
* request parameter limits
* header-related limits where appropriate

Use reasonable defaults for the application.

Do not choose extremely large limits merely for convenience.

Document exceptions where specific future APIs may require larger payloads.

---

## 4. Rate Limiting Foundation

Configure application-level rate limiting.

Requirements:

* Establish a global baseline rate limit.
* Make limits configurable through environment/configuration.
* Ensure health-check endpoints can be treated appropriately.
* Design the middleware so stricter limits can later be applied to sensitive routes such as:

  * login
  * password reset
  * OTP
  * public APIs

Do not implement authentication-specific rate limiting unless it is part of the existing project.

If a rate limiter already exists, inspect and improve it rather than creating another implementation.

---

## 5. Request Parameter Pollution

Protect against HTTP parameter pollution where appropriate.

Evaluate whether a package such as `hpp` is necessary.

Do not add it automatically without checking the project's actual request/query patterns.

If implemented, ensure it does not interfere with legitimate array query parameters.

---

## 6. Prototype Pollution / Unsafe Input Handling

Review Express parsing and object handling for common prototype-pollution risks.

Ensure:

* untrusted request data is never merged blindly into application objects
* request objects are not treated as trusted domain objects
* validation occurs before business logic
* unsafe dynamic object assignment is avoided

Do not claim that middleware alone completely prevents prototype pollution.

---

## 7. HTTP Method Handling

Define the application's supported HTTP methods.

Ensure unexpected methods are handled consistently.

Do not globally block methods that may be required by legitimate REST APIs.

---

## 8. HTTP Server Configuration

Inspect the Node.js HTTP server configuration and apply appropriate security-conscious settings where relevant.

Consider:

* request timeout
* headers timeout
* keep-alive timeout
* maximum request/header sizes

Do not introduce arbitrary timeout values without understanding their effect.

Document the chosen values.

---

## 9. Trust Proxy

Configure Express `trust proxy` correctly for the expected deployment architecture.

Do not blindly set:

```ts
app.set("trust proxy", true);
```

Determine whether the application will run:

* directly on the internet
* behind Nginx
* behind a cloud load balancer
* behind a reverse proxy/container platform

Make the configuration environment-aware if necessary.

This setting must be compatible with:

* secure cookies
* client IP detection
* rate limiting
* HTTPS detection

---

## 10. Sensitive Information Protection

Ensure production responses do not expose unnecessary implementation information.

Review:

* Express default headers
* error responses
* stack traces
* internal paths
* database errors
* environment variables
* dependency errors

Production API responses should not expose stack traces or internal implementation details.

Development responses may remain more informative where appropriate.

---

## 11. Error Handling Security

Inspect the existing global error middleware.

Ensure:

* errors are normalized into API responses
* internal errors are logged appropriately
* sensitive details are not returned to clients in production
* stack traces are not exposed in production
* known operational errors can be handled consistently

Do not create a second error-handling architecture if one already exists.

---

## 12. Security Headers Verification

After implementation, verify actual HTTP responses.

Do not only verify that the middleware exists in source code.

Start the server and inspect a representative endpoint.

Verify the expected security headers are actually present.

---

## 13. Request Logging

Inspect the current logging architecture.

If request logging is already implemented, ensure it does not log:

* passwords
* authorization headers
* JWTs
* cookies
* sensitive personal information
* secrets

If logging does not yet exist, do not introduce a large logging architecture unless necessary for this task.

Document what should be protected once logging is introduced.

---

## 14. Environment Configuration

All security-sensitive configuration must come from the project's configuration/environment system where appropriate.

Examples include:

* CORS origins
* rate limits
* proxy configuration
* environment mode
* request limits
* security-related feature flags

Never hardcode:

* secrets
* API keys
* JWT secrets
* production domains
* credentials

Do not create `.env` files containing real secrets.

Update `.env.example` if the project uses one.

---

# Middleware Ordering

Determine the correct middleware order based on the existing architecture.

A typical API flow may resemble:

```text
Express app
    ↓
Security / HTTP configuration
    ↓
Helmet
    ↓
CORS
    ↓
Request parsing limits
    ↓
Request parameter protection
    ↓
Rate limiting
    ↓
Request logging
    ↓
API routes
    ↓
404 handler
    ↓
Global error handler
```

This is only a reference.

**Do not blindly copy this order.**

Inspect the existing application and determine the correct ordering for this codebase.

Pay particular attention to:

* CORS before routes
* body parsing before controllers that consume bodies
* rate limiting before expensive application work
* 404 handling after routes
* error middleware as the final middleware

---

# Dependency Rules

Before installing any package:

1. Check whether equivalent functionality already exists.
2. Check `package.json`.
3. Prefer mature, actively maintained security libraries.
4. Avoid duplicate libraries solving the same problem.
5. Add only dependencies justified by the implementation.
6. Use versions compatible with the project's current Node.js and TypeScript versions.

Potential libraries may include:

* `helmet`
* `cors`
* `express-rate-limit`
* `hpp`

But these are **candidates, not mandatory dependencies**.

The agent must determine whether each is actually required.

---

# Architecture Requirements

Follow the existing project architecture.

Prefer centralized configuration such as:

```text
src/
├── config/
├── constants/
├── middleware/
├── routes/
├── controllers/
├── services/
└── ...
```

If the project already uses a different structure, follow that structure.

Security configuration should not be scattered throughout individual routes.

Prefer dedicated middleware/configuration modules when consistent with the existing architecture.

---

# Important Non-Goals

Do NOT implement these as part of this task:

* JWT authentication
* login/register
* password hashing
* RBAC
* permissions
* user management
* database security schema
* refresh tokens
* OAuth
* email verification
* OTP
* business modules
* file upload security
* Cloudinary integration
* payment security
* API documentation redesign
* frontend changes

These will be handled in separate tasks.

---

# Testing / Validation

Create or update tests where the existing testing architecture supports them.

At minimum verify:

### Security headers

A request should return the expected Helmet/security headers.

### CORS

Verify:

* allowed origin
* disallowed origin
* preflight request
* credentials behavior if enabled

### Rate limiting

Verify the configured limit is enforced.

Do not make tests unnecessarily slow.

### Body limits

Verify oversized requests are rejected appropriately.

### Error handling

Verify production-style errors do not expose:

* stack traces
* internal file paths
* database details
* secrets

### Health endpoint

If the project already has or is currently implementing a health-check endpoint, verify that security middleware does not unintentionally break it.

---

# Security Review Checklist

Before marking the task complete, review:

* [ ] Helmet configured
* [ ] CORS configured securely
* [ ] No unrestricted credentialed wildcard CORS
* [ ] Request body limits configured
* [ ] Rate limiting configured
* [ ] Parameter pollution protection evaluated
* [ ] Trust proxy evaluated
* [ ] HTTP server timeouts evaluated
* [ ] Sensitive error details hidden in production
* [ ] Sensitive request data excluded from logs
* [ ] No secrets committed
* [ ] Environment configuration documented
* [ ] Middleware ordering reviewed
* [ ] Existing architecture preserved
* [ ] No duplicate middleware
* [ ] No unnecessary dependencies
* [ ] Tests/validation executed
* [ ] Final diff reviewed

---

# Final Deliverables

The final implementation should provide:

1. A secure Express application foundation.
2. Centralized security configuration.
3. Secure environment/configuration handling.
4. Appropriate security middleware.
5. Tests or verification for the implemented security controls.
6. Updated `.env.example`/documentation where applicable.
7. A final implementation report containing:

   * changed files
   * dependency changes
   * security controls implemented
   * commands executed
   * validation results
   * remaining concerns

## Critical Rule

**Do not blindly implement every item in this document.**

First inspect the existing codebase and determine what is already present.

Reuse existing infrastructure where appropriate.

If a security control is not applicable, explain why in the implementation plan and final report.

If any requirement conflicts with an existing project rule or architecture, stop and identify the conflict rather than guessing.

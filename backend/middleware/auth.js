const { createAuthMiddleware } = require('@nishant625/auth-node');

const requireAuth = createAuthMiddleware(process.env.AUTH_SERVER_URL || 'http://localhost:4000');

module.exports = { requireAuth };

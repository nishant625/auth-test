const { PrismaClient } = require('../generated/auth-client');
const authPrisma = new PrismaClient();
module.exports = authPrisma;

const authPrisma = require('../lib/authPrisma');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const tokenRecord = await authPrisma.token.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (tokenRecord.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Token expired' });
    }

    req.userId = tokenRecord.userId;
    req.clientId = tokenRecord.clientId;

    next();
  } catch (err) {
    res.status(500).json({ error: 'Auth check failed' });
  }
};

module.exports = authMiddleware;

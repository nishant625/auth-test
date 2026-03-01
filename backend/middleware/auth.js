const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SENTINEL = process.env.AUTH_SERVER_URL || 'http://localhost:4000';
let cachedPublicKey = null;

const fetchPublicKey = async () => {
  const res = await fetch(`${SENTINEL}/.well-known/jwks.json`);
  const { keys } = await res.json();
  const keyObj = crypto.createPublicKey({ key: keys[0], format: 'jwk' });
  return keyObj.export({ type: 'spki', format: 'pem' });
};

const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = header.slice(7);

  try {
    if (!cachedPublicKey) cachedPublicKey = await fetchPublicKey();

    const decoded = jwt.verify(token, cachedPublicKey, {
      algorithms: ['RS256'],
      issuer: SENTINEL,
    });

    req.user = decoded; // { sub, email, aud, scope, exp, iat }
    next();
  } catch (err) {
    // Sentinel restarts regenerate the key — clear cache and retry once
    if (err.name === 'JsonWebTokenError') {
      cachedPublicKey = null;
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { requireAuth };

const express = require('express');
const router = express.Router();

router.post('/api/introspect', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const introspectUrl = `${process.env.AUTH_SERVER_URL}/oauth/introspect`;

    const response = await fetch(introspectUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Introspection request failed' });
    }

    const introspectData = await response.json();

    res.json(introspectData);
  } catch (error) {
    res.status(500).json({ error: 'Introspection failed', message: error.message });
  }
});

module.exports = router;

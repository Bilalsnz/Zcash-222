// Same-origin proxy for the public Zcash mainnet API.
// This avoids browser CORS restrictions without requiring an API key.
const UPSTREAM = 'https://api.mainnet.cipherscan.app/api';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const requested = typeof req.query.path === 'string' ? req.query.path : '';
  const path = requested.startsWith('/') ? requested : '/' + requested;
  const allowed =
    path === '/blockchain-info' ||
    path === '/blocks?limit=1' ||
    /^\/tx\/[a-fA-F0-9]{64}$/.test(path) ||
    path === '/tx/broadcast';

  if (!allowed) return res.status(400).json({ error: 'Unsupported Zcash API route' });
  if (path === '/tx/broadcast' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Broadcast requires POST' });
  }
  if (path !== '/tx/broadcast' && req.method !== 'GET') {
    return res.status(405).json({ error: 'This route is read-only' });
  }

  const upstreamPath = path === '/tx/broadcast'
    ? '/tx/broadcast'
    : path === '/blockchain-info'
      ? '/blockchain-info'
      : path === '/blocks?limit=1'
        ? '/blocks?limit=1'
        : path;

  try {
    const options = { method: req.method, headers: { Accept: 'application/json' } };
    if (req.method === 'POST') {
      options.headers['Content-Type'] = 'application/json';
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    }
    const upstream = await fetch(UPSTREAM + upstreamPath, options);
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json; charset=utf-8');
    return res.send(text);
  } catch (error) {
    return res.status(502).json({
      error: 'Unable to reach the public Zcash API from the server',
      detail: error && error.message ? error.message : 'Upstream request failed'
    });
  }
};

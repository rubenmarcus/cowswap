export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const BITTE_API_KEY = process.env.BITTE_API_KEY;
  const BITTE_API_URL = 'https://ai-runtime-446257178793.europe-west1.run.app/chat';

  if (!BITTE_API_KEY) {
    return res.status(500).json({ error: 'BITTE_API_KEY not configured' });
  }

  try {
    const response = await fetch(BITTE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BITTE_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error in chat API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 
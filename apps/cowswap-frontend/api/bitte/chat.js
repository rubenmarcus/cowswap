module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET requests (for testing)
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Bitte Chat API is working!', 
      usage: 'Send POST request with {"message": "your message"} in body',
      endpoint: '/api/bitte/chat'
    });
  }

  // Only allow POST requests for actual chat
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use GET for testing or POST for chat.' });
  }

  // Validate request body for POST requests
  if (!req.body || !req.body.message) {
    return res.status(400).json({ 
      error: 'Bad request', 
      details: 'Request body must contain a "message" field',
      example: { message: 'Hello, how are you?' }
    });
  }

  const BITTE_API_KEY = process.env.BITTE_API_KEY;
  const BITTE_API_URL = 'https://ai-runtime-446257178793.europe-west1.run.app/chat';

  if (!BITTE_API_KEY) {
    return res.status(500).json({ 
      error: 'BITTE_API_KEY not configured',
      details: 'Server configuration error. Please contact administrator.'
    });
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
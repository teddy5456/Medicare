const http = require('http');
const fetch = require('node-fetch');
const { ngrokUrl } = require('../../ngrokconfig');

const consumerKey = 'meG8TAvNcLxMRydjNyHgnFAmYgXzlMlngd0CXM8rcsatVVSV';
const consumerSecret = 'LEQWl23Ka55iOh5soAB3y80gKZKJw57bbJgbhvihbXbdKSyMUMkDjVsGtxO0qPFv';
const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const shortcode = '174379';

const allowedOrigins = ['http://127.0.0.1:5500'];

async function getAccessToken() {
  const creds = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const res = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${creds}` }
  });
  if (!res.ok) throw new Error(`Failed to get token: ${res.statusText}`);
  const data = await res.json();
  return data.access_token;
}

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}

function setCORSHeaders(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function handleSTKPush(req, res) {
  try {
    const { phoneNumber } = await parseJSONBody(req);
    if (!phoneNumber) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'phoneNumber is required' }));
    }

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');
    const accessToken = await getAccessToken();

    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: 1,
      PartyA: 254708374149,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: `${ngrokUrl}/api/mpesa/callback`,
      AccountReference: 'CheckupDummy',
      TransactionDesc: 'Clinic Visit Payment'
    };

    const stkRes = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const result = await stkRes.json();
    res.writeHead(stkRes.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));

  } catch (err) {
    console.error('STK Push error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function handleMpesaCallback(req, res) {
  try {
    const data = await parseJSONBody(req);
    const resultCode = data?.Body?.stkCallback?.ResultCode;
    const resultDesc = data?.Body?.stkCallback?.ResultDesc;

    if (resultCode === 0) {
      console.log('[M-Pesa Callback] Payment successful:', resultDesc);
    } else {
      console.log(`[M-Pesa Callback] Payment failed (ResultCode: ${resultCode}):`, resultDesc);
    }
  } catch (err) {
    console.error('Callback parsing error:', err);
  }
  res.writeHead(200);
  res.end('Received');
}

const server = http.createServer((req, res) => {
  setCORSHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === 'POST' && req.url === '/api/mpesa/stkpush') {
    return handleSTKPush(req, res);
  } else if (req.method === 'POST' && req.url === '/api/mpesa/callback') {
    return handleMpesaCallback(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log('👉 To expose it, run: ngrok http 3000');
});

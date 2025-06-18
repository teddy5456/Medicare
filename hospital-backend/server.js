const http = require('http');
const { parse } = require('url');
const { ngrokUrl } = require('../ngrokconfig');
const { initiateSTKPush, handleMpesaCallback } = require('./controllers/mpesa.controller');

const { handleRegister, handleLogin, getUsers, getUserById } = require('./controllers/auth.controller');
const {
    createAppointment,
    updateAppointment,
    getAppointments,
    cancelAppointment
} = require('./controllers/appointments');

// List of allowed origins (add all your frontend URLs here)
const allowedOrigins = new Set([
    'http://127.0.0.1:5500', // Local development
    'https://b3d8-2c0f-fe38-2017-d06a-d9d6-8d37-6996-e209.ngrok-free.app', // Your ngrok URL
    // Add other domains as needed
]);

const server = http.createServer((req, res) => {
    // Handle CORS
    const origin = req.headers.origin;
    if (allowedOrigins.has(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // If you need cookies/auth
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204); // No Content - standard for successful OPTIONS
        return res.end();
    }

    const parsedUrl = parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;

    // Auth routes
    if (method === 'POST' && path === '/register') return handleRegister(req, res);
    if (method === 'POST' && path === '/login') return handleLogin(req, res);
    if (method === 'GET' && path === '/users') return getUsers(req, res);
    if (method === 'GET' && path === '/user') return getUserById(req, res);

    // Appointment routes
    if (method === 'POST' && path === '/api/appointments') return createAppointment(req, res);
    if (method === 'PUT' && path.startsWith('/api/appointments/')) return updateAppointment(req, res);
    if (method === 'GET' && path === '/api/appointments') return getAppointments(req, res);
    if (method === 'DELETE' && path === '/api/appointments') return cancelAppointment(req, res);

    // M-Pesa routes
    if (method === 'POST' && path === '/api/mpesa/stkpush') return initiateSTKPush(req, res);
    if (method === 'POST' && path === '/api/mpesa/callback') return handleMpesaCallback(req, res);

    // 404 fallback
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
});
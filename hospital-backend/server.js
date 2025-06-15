const http = require('http');
const { parse } = require('url');

const { handleRegister, handleLogin, getUsers } = require('./controllers/auth.controller');
const {
    createAppointment,
    updateAppointment,
    getAppointments,
    cancelAppointment
} = require('./controllers/appointments');

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }

    const parsedUrl = parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;

    // Auth routes
    if (method === 'POST' && path === '/register') return handleRegister(req, res);
    if (method === 'POST' && path === '/login') return handleLogin(req, res);
    if (method === 'GET' && path === '/users') return getUsers(req, res);

    // Appointment routes
    if (method === 'POST' && path === '/api/appointments') return createAppointment(req, res);
    if (method === 'PUT' && path.startsWith('/api/appointments/')) return updateAppointment(req, res);
    if (method === 'GET' && path === '/api/appointments') return getAppointments(req, res);
    if (method === 'DELETE' && path === '/api/appointments') return cancelAppointment(req, res);

    // 404 fallback
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
});

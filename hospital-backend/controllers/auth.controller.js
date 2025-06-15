const { connectToDatabase } = require('../config/db');
const bcrypt = require('bcrypt');

// REGISTER USER
async function handleRegister(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const form = JSON.parse(body);

            if (!form.firstName || !form.lastName || !form.email || !form.phone ||
                !form.dob || !form.gender || !form.password || !form.confirmPassword) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'All fields are required' }));
            }

            if (form.password !== form.confirmPassword) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Passwords do not match' }));
            }

            if (!form.terms) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'You must agree to the terms' }));
            }

            const db = await connectToDatabase();

            if (await db.collection('users').findOne({ email: form.email })) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Email already registered' }));
            }

            const user = {
                firstName: form.firstName,
                lastName: form.lastName,
                fullName: `${form.firstName} ${form.lastName}`,
                email: form.email,
                phone: form.phone,
                dob: new Date(form.dob),
                gender: form.gender,
                password: await bcrypt.hash(form.password, 10),
                role: form.role || 'patient',
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                agreedToTerms: true
            };

            const result = await db.collection('users').insertOne(user);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Registration successful',
                userId: result.insertedId
            }));

        } catch (error) {
            console.error('Registration error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    });
}

// LOGIN USER
async function handleLogin(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const form = JSON.parse(body);
            const db = await connectToDatabase();

            const user = await db.collection('users').findOne({ email: form.email });
            if (!user) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Invalid credentials' }));
            }

            const passwordMatch = await bcrypt.compare(form.password, user.password);
            if (!passwordMatch) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Invalid credentials' }));
            }

            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://127.0.0.1:5500'
            });
            res.end(JSON.stringify({
                message: 'Login successful',
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role
                }
            }));
        } catch (error) {
            console.error('Login error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    });
}

// GET USERS (Filter by Role)
async function getUsers(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }

    try {
        const db = await connectToDatabase();
        const url = new URL(req.url, `http://${req.headers.host}`);
        const role = url.searchParams.get('role');

        const query = {};
        if (role) query.role = role;

        const users = await db.collection('users').find(query).project({
            password: 0 // Hide password field
        }).toArray();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } catch (error) {
        console.error('Get users error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
}

module.exports = {
    handleRegister,
    handleLogin,
    getUsers
};

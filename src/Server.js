// server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config(); // Loads ADMIN_EMAIL and ADMIN_PASSWORD

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

// 1. Login Route
app.post('/api/login', (req, "res") => {
    const { email, password } = req.body;

    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (email === envEmail && password === envPassword) {
        // Drop a secure session cookie valid for 7 days
        res.cookie('admin_session', 'authenticated_true', {
            maxAge: SEVEN_DAYS,
            httpOnly: true, // Prevents XSS script access
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax'
        });
        return res.status(200).json({ success: true, message: "Logged in successfully" });
    }

    return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// 2. Authentication Check Route
app.get('/api/auth-check', (req, res) => {
    if (req.cookies.admin_session === 'authenticated_true') {
        return res.status(200).json({ authenticated: true });
    }
    return res.status(401).json({ authenticated: false });
});

// 3. Logout Route
app.post('/api/logout', (req, res) => {
    res.clearCookie('admin_session');
    return res.status(200).json({ success: true });
});

app.listen(5000, () => console.log('Auth backend spinning on port 5000'));
require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Visitor notification middleware for homepage
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));

    try {
        await transporter.sendMail({
            from: 'Portfolio Notifier <' + process.env.EMAIL_USER + '>',
            to: process.env.EMAIL_USER,
            subject: 'New Visitor Alert!',
            text: `Someone just visited your portfolio at ${new Date().toLocaleString()}`
        });
        console.log('Visitor email sent!');
    } catch (err) {
        console.error('Error sending visitor email:', err);
    }
});

// Contact form route
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'All fields are required.' });

    try {
        await transporter.sendMail({
            from: `${name} <${email}>`,
            to: process.env.EMAIL_USER,
            subject: `Portfolio Contact Form: ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        });
        res.json({ success: true });
    } catch (err) {
        console.error('Email error:', err);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

// Serve other pages
const pages = ['projects.html', 'about.html', 'contact.html'];
pages.forEach(page => {
    app.get(`/${page}`, (req, res) => res.sendFile(path.join(__dirname, page)));
});

// Test email route (optional)
app.get('/test-email', async (req, res) => {
    try {
        await transporter.sendMail({
            from: 'Test <' + process.env.EMAIL_USER + '>',
            to: process.env.EMAIL_USER,
            subject: 'Test Email',
            text: 'This is a test email from your portfolio.'
        });
        res.send('Test email sent!');
    } catch (err) {
        console.error('Test email error:', err);
        res.send('Failed to send test email.');
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Contact form
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'All fields are required.' });

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL_USER,
            subject: `Portfolio Contact Form: ${name}`,
            html: `
                <h2>New Message from Portfolio</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p>Sandile Web Solutions &copy; 2025</p>
            `
        });

        res.json({ success: true });
    } catch (err) {
        console.error('Email error:', err);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

// Serve HTML pages
['index.html','about.html','projects.html','contact.html'].forEach(page => {
    app.get(`/${page}`, (req,res) => res.sendFile(path.join(__dirname,page)));
});
app.get('/', (req,res) => res.sendFile(path.join(__dirname,'index.html')));

// Test email route
app.get('/test-email', async (req,res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
            from: `Test <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'Test Email',
            text: 'This is a test email from your portfolio.'
        });

        res.send('Test email sent!');
    } catch(err) {
        console.error(err);
        res.send('Failed to send test email.');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

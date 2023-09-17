const nodemailer = require('nodemailer');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { body, validationResult } = require('express-validator');
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/submit-form', [
    body('fullName').trim().isLength({ min: 2 }).escape(),
    body('subject').trim().isLength({ min: 3 }).escape(),
    body('emailAddress').trim().isEmail().normalizeEmail(),
    body('phoneNumber').trim().isMobilePhone('any').escape(),
    body('message').trim().isLength({ min: 40 }).escape(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fullName, subject, emailAddress, phoneNumber, message } = req.body;

        const transporter = nodemailer.createTransport("SMTP",{
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: 'montoyamasonry@outlook.com',
            subject: `New Contact Form Submission! ${subject}`,
            text: `Full Name: ${fullName}\nEmail: ${emailAddress}\nPhone: ${phoneNumber}\n\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error'});
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
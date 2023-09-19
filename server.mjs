import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
const port = process.env.PORT || 3000;
const app = express();
const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};


app.use(cors(corsOptions));
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
            host: "smtp-mail.outlook.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_SENDER,
            subject: `New Contact Form Submission! ${subject}`,
            text: `Full Name: ${fullName}\nEmail: ${emailAddress}\nPhone: ${phoneNumber}\n\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Form submitted successfully' });
        console.log('Response Status Code:', 200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error'});
        console.log('Response Status Code:', 500);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
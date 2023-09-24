import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import { body, validationResult } from 'express-validator';
const port = process.env.PORT || 3000;
const app = express();
const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
dotenv.config();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to mySQL:', err);
        return;
    } else {
        console.log('Connected to mySQL database');
    }
});

const validateFormSubmission = [
    body('fullName').trim().isLength({ min: 2 }).escape(),
    body('subject').trim().isLength({ min: 3 }).escape(),
    body('emailAddress').trim().isEmail().normalizeEmail(),
    body('phoneNumber').trim().isMobilePhone('any').escape(),
    body('message').trim().isLength({ min: 40 }).escape(),
];

app.post('/api/submit-form', validateFormSubmission, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, subject, emailAddress, phoneNumber, message} = req.body;
    const query = 'INSERT INTO contact_form_submissions (fullName, subject, emailAddress, phoneNumber, message) VALUES (?, ?, ?, ?, ?)';
    const values = [fullName, subject, emailAddress, phoneNumber, message];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            return res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ message: 'Form submitted successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
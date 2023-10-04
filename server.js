import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';
import { body, validationResult } from 'express-validator';
const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const connection = mysql.createConnection({
    database: process.env.MYSQLDATABASE,
    host: process.env.MYSQLHOST,
    password: process.env.MYSQLPASSWORD,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER
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

app.post(process.env.MYSQL_URL, validateFormSubmission, (req, res) => {
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

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
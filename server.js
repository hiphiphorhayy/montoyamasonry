import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2/promise';
import { body, validationResult } from 'express-validator';
const app = express();
dotenv.config();
let timeStamp;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const pool = mysql.createPool({
    database: process.env.MYSQLDATABASE,
    host: process.env.MYSQLHOST,
    password: process.env.MYSQLPASSWORD,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    waitForConnections: true,
    connectionLimit: 10,
});

const validateFormSubmission = [
    body('fullName').trim().isLength({ min: 2 }).escape(),
    body('subject').trim().isLength({ min: 3 }).escape(),
    body('emailAddress').trim().isEmail().normalizeEmail(),
    body('phoneNumber').trim().isMobilePhone('any').escape(),
    body('message').trim().isLength({ min: 40 }).escape(),
];

app.post('/api/submit-form', validateFormSubmission, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {fullName, subject, emailAddress, phoneNumber, message, timeStamp} = req.body;
    const query = 'INSERT INTO contact_forms (fullName, subject, emailAddress, phoneNumber, message, timeStamp) VALUES (?, ?, ?, ?, ?, CONVERT_TZ(NOW(), \'UTC\', \'US/Eastern\'))';
    const values = [fullName, subject, emailAddress, phoneNumber, message, timeStamp];

    try {
        const connection = await pool.getConnection();
        await connection.query(query, values);
        connection.release();
        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (err) {
        console.error('Error inserting data into the database:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

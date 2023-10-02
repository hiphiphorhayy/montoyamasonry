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
app.use(express.static('public'));


const submitFormData = () => {
    const formData = new URLSearchParams(new FormData(form));

    fetch('http://localhost:3000/api/submit-form', {
        method: 'POST',
        body: formData,
    })
    .then((res) => {
        console.log('Response Status Code:', res.status);
        if (res.ok) {
            form.reset();
            fullNameInput.style.backgroundColor = '';
            fullNameInput.classList.add('bg-gray-200');
            subjectInput.style.backgroundColor = '';
            subjectInput.classList.add('bg-gray-200');
            emailAddressInput.style.backgroundColor = '';
            emailAddressInput.classList.add('bg-gray-200');
            phoneNumberInput.style.backgroundColor = '';
            phoneNumberInput.classList.add('bg-gray-200');
            messageInput.style.backgroundColor = '';
            messageInput.classList.add('bg-gray-200');
            formSubmissionStatus.textContent = 'Form submitted successfully!';
            formSubmissionStatus.classList.remove('bg-black');
            formSubmissionStatus.style.backgroundColor = 'rgb(21, 128, 61)';
        } else {
            formSubmissionStatus.textContent = 'Form submission failed';
            formSubmissionStatus.classList.remove('bg-black');
            formSubmissionStatus.style.backgroundColor = '';
            formSubmissionStatus.classList.add('bg-red-600');
        }
    })
    .catch((error) => {
        console.error('Fetch Error:', error);
        formSubmissionStatus.textContent = 'An error occured, please try again.';
        formSubmissionStatus.classList.add('bg-black', 'text-white-700');
    });
};


form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(formValidityCheck()) {
        submitButton.disabled = true;
        formSubmissionStatus.textContent = 'Submitting...';
        formSubmissionStatus.classList.add('bg-black', 'text-white');

        setTimeout(() => {
            submitFormData();
        }, 500);
    }
});

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
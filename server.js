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
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db.cjs');
const { secretKey, verifyToken } = require('./token.cjs');


router.post('/signup', async (req, res) => {
    const { username, name, surname, password } = req.body;

    if (!username || !name || !surname || !password) {
        console.log('All fields are required');
        return res.status(400).send('All fields are required');
    }

    try {
        const client = await db.connect();

        const existingUser = await client.collection('users').findOne({ username });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username,
            name,
            surname,
            password: hashedPassword
        };
        await client.collection('users').insertOne(newUser);

        res.status(201).send('User registered');
    } catch (error) {
        console.log('Error registering user', error);
        res.status(500).send('An error occurred while registering the user');
    }
});

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('All fields are required');
    }
    
    try {
        const client = await db.connect();

        const user = await client.collection('users').findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid username or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid username or password');
        }

        const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1d' });
        
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in', error);
        res.status(500).send('An error occurred while logging in');
    }
});

router.get('/verifyToken', verifyToken, (req, res) => {
    res.status(200).send('Token is valid');
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).send('User logged out');
});

module.exports = router;


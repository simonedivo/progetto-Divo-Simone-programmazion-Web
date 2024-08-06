const express = require ('express');
const db = require ('./db.cjs');
const router = express.Router();
const jwt = require ('jsonwebtoken');
const { verifyToken } = require ('./token.cjs');

router.get('/getUser', verifyToken, async (req, res) => {
    try {
        const client = await db.connect();
        const user = await client.collection('users').findOne({ username: req.user.username }, { projection: { password: 0 } });
        if (!user) {
            res.status(404).send('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user', error);
    }
});

router.get('/getUsers', verifyToken, async (req, res) => {
    try {
        const client = await db.connect();
        const user = await client.collection('users').findOne({ username: req.user.username }, { projection: { password: 0 } });
        if (!user) {
            res.status(404).send('User not found');
        }
        const users = await client.collection('users').find({ username: { $ne: req.user.username } }, { projection: { password: 0 } }).toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users', error);
    }
});

module.exports = router;
const express = require ('express');
const db = require ('./db.cjs');
const router = express.Router();
const { verifyToken } = require ('./token.cjs');
const { ObjectId } = require('mongodb');

router.get('/', verifyToken, async (req, res) => {
    try {
        const client = await db.connect();
        const transactions = await client.collection('transactions').find({
            $or: [
                { 'quotes.username': req.user.username },
                { createdBy: req.user.username }
            ]
        }).toArray();
        
        let balance = 0;
        transactions.forEach(transaction => {
            transaction.quotes.forEach(quote => {
                if (quote.username === req.user.username) {
                    balance += quote.share;
                }
            });
        });

        res.status(200).json({ balance });
    } catch (error) {
        console.error('Error getting transactions', error);
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    const otherUserId = req.params.id;

    try {
        const client = await db.connect();
        const otherUser = await client.collection('users').findOne({ _id: new ObjectId(otherUserId) });
        if (!otherUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const transactions = await client.collection('transactions').find({
            $and: [
                {
                    $or: [
                        { 'quotes.username': req.user.username },
                        { createdBy: req.user.username }
                    ]
                },
                {
                    $or: [
                        { 'quotes.username': otherUser.username },
                        { createdBy: otherUser.username }
                    ]
                }
            ]
        }).toArray();

        let balance = 0;
        transactions.forEach(transaction => {
            transaction.quotes.forEach(quote => {
                if (quote.username === req.user.username) {
                    balance += quote.share;
                }
            });
        });

        res.status(200).json({ balance });
    } catch (error) {
        console.error('Error getting transactions', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;

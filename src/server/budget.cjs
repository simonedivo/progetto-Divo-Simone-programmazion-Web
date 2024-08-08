const express = require ('express');
const db = require ('./db.cjs');
const router = express.Router();
const jwt = require ('jsonwebtoken');
const { verifyToken } = require ('./token.cjs');

router.get('/whoami', verifyToken, async (req, res) => {
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

router.get('/all', verifyToken, async (req, res) => {
    try {
        const client = await db.connect();
        const users = await client.collection('users').find({}, { projection: { password: 0 } }).toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users', error);
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const client = await db.connect();
        const transactions = await client.collection('transactions').find({
            $or: [
                { 'quotes.username': req.user.username },
                { createdBy: req.user.username }
            ]
        }).toArray();
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error getting transactions', error);
    }
});

router.get('/:year', verifyToken, async (req, res) => {
    try {
        const client = await db.connect();
        const transactions = await client.collection('transactions').find({
            $and: [
                {
                    $or: [
                        { 'quotes.username': req.user.username },
                        { createdBy: req.user.username }
                    ]
                },
                {
                    $expr: {
                        $eq: [{ $year: "$date" }, parseInt(req.params.year)]
                    }
                }
            ]
        }).toArray();
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error getting transactions', error);
    }
});

router.get('/:year/:month', verifyToken, async (req, res) => {
    try {
        const client = await db.connect();
        const transactions = await client.collection('transactions').find({
            $and: [
                {
                    $or: [
                        { 'quotes.username': req.user.username },
                        { createdBy: req.user.username }
                    ]
                },
                {
                    $expr: {
                        $eq: [{ $year: "$date" }, parseInt(req.params.year)]
                    }
                },
                {
                    $expr: {
                        $eq: [{ $month: "$date" }, parseInt(req.params.month)]
                    }
                }
            ]
        }).toArray();
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error getting transactions', error);
    }
});

router.get('/:year/:month/:id', verifyToken, async (req, res) => {
    try {
        const client = await db.connect();
        const transactions = await client.collection('transactions').find({
            $and: [
                {
                    $or: [
                        { 'quotes.username': req.user.username },
                        { createdBy: req.user.username }
                    ]
                },
                {
                    $expr: {
                        $eq: [{ $year: "$date" }, parseInt(req.params.year)]
                    }
                },
                {
                    $expr: {
                        $eq: [{ $month: "$date" }, parseInt(req.params.month)]
                    }
                },
                { 
                    id: parseInt(req.params.id)
                },
            ]
        }).toArray();
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error getting transactions', error);
    }
});

//Ho aggiunto il giorno siccome ho costruito il db con la data completa
router.post('/:year/:month/:day', verifyToken, async (req, res) => {
    const { year, month, day } = req.params;
    const { category, description, cost, quotes } = req.body;
    const { username } = req.user;

    const client = await db.connect();
    const maxIdTransaction = await client.collection('transactions').find({}).sort({ id: -1 }).limit(1).toArray();
    const maxId = maxIdTransaction.length > 0 ? maxIdTransaction[0].id : 0;
    const newId = maxId + 1;

    const processedQuotes = quotes.length === 0 ? [{ username, share: cost }] : quotes.map(quote => ({
        username: quote.contributor || username, // Use the contributor field if available, otherwise use the current user's username
        share: quote.share
    }));
    
    const newTransaction = {
        id: newId,
        createdBy: username,
        category,
        description,
        cost,
        quotes: processedQuotes,
        date: new Date(year, month, day)
    };

    try {
        const result = await client.collection('transactions').insertOne(newTransaction);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating transaction', error);
    }
});

router.put('/:year/:month/:id', verifyToken, async (req, res) => {

});

router.delete('/:year/:month/:id', verifyToken, async (req, res) => {

});

module.exports = router;
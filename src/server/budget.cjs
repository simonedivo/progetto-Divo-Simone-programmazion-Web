const express = require ('express');
const db = require ('./db.cjs');
const router = express.Router();
const { verifyToken } = require ('./token.cjs');

//Non ho fatto il file users.cjs con router.get('/search') in quanto la ricerca utenti è gestita da simpletypeahead nel frontend

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

router.get('/search', verifyToken, async (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : '';
    console.log(query);
    try {
        const client = await db.connect();
        const transactions = await client.collection('transactions').find({
            $and: [
                {$or: [
                    { 'quotes.username': req.user.username },
                    { createdBy: req.user.username }
                ]},
                {description: { $regex: query, $options: 'i' }},
            ]
        }).toArray();
        console.log(transactions);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error getting transactions', error);
        res.status(500).json({ message: 'Internal server error' });
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

    try {
        const client = await db.connect();
        const maxIdTransaction = await client.collection('transactions').find({}).sort({ id: -1 }).limit(1).toArray();
        const maxId = maxIdTransaction.length > 0 ? maxIdTransaction[0].id : 0;
        const newId = maxId + 1;

        const processedQuotes = quotes.length === 0 ? [{ username, share: cost }] : quotes.map(quote => ({
            username: quote.contributor || username,
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


        const result = await client.collection('transactions').insertOne(newTransaction);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating transaction', error);
    }
});

router.put('/:year/:month/:id', verifyToken, async (req, res) => {
    const { year, month, id } = req.params;
    const { category, description} = req.body;

    try{
        const client = await db.connect();
        const result = await client.collection('transactions').updateOne(
            {
                id: parseInt(id),
                $expr: {
                    $and: [
                        { $eq: [{ $year: "$date" }, parseInt(year)] },
                        { $eq: [{ $month: "$date" }, parseInt(month)] }
                    ]
                }
            },
            { $set: { category, description } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (error) {
        console.error('Error updating transaction', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:year/:month/:id', verifyToken, async (req, res) => {
    const { year, month, id} = req.params;
    
    try {
        const client = await db.connect();
        const result = await client.collection('transactions').deleteOne(
            {
                id: parseInt(id),
                $expr: {
                    $and: [
                        { $eq: [{ $year: "$date" }, parseInt(year)] },
                        { $eq: [{ $month: "$date" }, parseInt(month)] }
                    ]
                }
            }
        );

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
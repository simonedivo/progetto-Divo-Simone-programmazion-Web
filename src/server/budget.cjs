const express = require ('express');
const db = require ('./db.cjs');
const router = express.Router();
const jwt = require ('jsonwebtoken');
const { verifyToken } = require ('./token.cjs');

router.get('/', verifyToken, async (req, res) => {
    try {
        const client = await db.connect();
        const transactions = await client.collection('transactions').find({
            $or: [
                { 'quotes.contributors': req.user.username },
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
                        { 'quotes.contributors': req.user.username },
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
                        { 'quotes.contributors': req.user.username },
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
                        { 'quotes.contributors': req.user.username },
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

module.exports = router;
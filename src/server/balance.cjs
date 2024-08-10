const express = require ('express');
const db = require ('./db.cjs');
const router = express.Router();
const { verifyToken } = require ('./token.cjs');

router.get('', verifyToken, async (req, res) => {

});

router.get('/:id', verifyToken, async (req, res) => {

});

module.exports = router;

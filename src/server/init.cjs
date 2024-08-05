const express = require('express');
const placeholderDB = require('./placeholderDB.cjs');
const auth = require('./auth.cjs');
const user = require('./user.cjs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api/auth', auth);
app.use('/api/user', user);

app.all('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', '404.html'));
});


async function boot() {
    try{
        await placeholderDB.initializeDB();
        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing the database', error);
    }
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}

boot();
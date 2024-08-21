const express = require('express');
const placeholderDB = require('./placeholderDB.cjs');
const auth = require('./auth.cjs');
const budget = require('./budget.cjs');
const balance = require('./balance.cjs');
const path = require('path');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const port = 3000;

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/api/auth', auth);
app.use('/api/budget', budget);
app.use('/api/balance', balance);

app.all('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', '404.html'));
});


async function boot() {
    try{
        //await placeholderDB.resetDB();
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
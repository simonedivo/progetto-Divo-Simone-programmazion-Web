const db = require('./db.js');

module.exports = {
    initializeDB: async () => {
        try {
            const client = await db.connect();
            const users = client.db().collection('users').find({});
            const transactions = client.db().collection('transactions').find({});

            const hasUsers = await users.hasNext();
            const hasTransactions = await transactions.hasNext();

            if (!hasUsers && !hasTransactions) {
                await client.db().collection('users').insertMany([
                    {username: '', name: '', surname: '', password: await bcrypt.hash('', 10)},
                    {username: '', name: '', surname: '', password: await bcrypt.hash('', 10)},
                    {username: '', name: '', surname: '', password: await bcrypt.hash('', 10)}, 
                    {username: '', name: '', surname: '', password: await bcrypt.hash('', 10)},
                    {username: '', name: '', surname: '', password: await bcrypt.hash('', 10)},
                ]);

                await client.db().collection('transactions').insertMany([
                    {},
                    {},
                    {},
                    {},
                    {},
                ]);
            }
            
            users.close();
            transactions.close();
        } catch (error) {
            console.error('Error initializing the database');
            throw error;
        }
    }
}
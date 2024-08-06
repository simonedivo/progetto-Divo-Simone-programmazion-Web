const db = require('./db.cjs');
const bcrypt = require('bcrypt');

module.exports = {
    initializeDB: async () => {
        try {
            const client = await db.connect();
            const users = client.collection('users').find({});
            const transactions = client.collection('transactions').find({});

            const hasUsers = await users.hasNext();
            const hasTransactions = await transactions.hasNext();

            if (!hasUsers && !hasTransactions) {
                await client.collection('users').insertMany([
                    {username: 'Solid Snake', name: 'David', surname: 'Hayter', password: await bcrypt.hash('shadowmoses', 10)},
                    {username: 'Otacon', name: 'Hal', surname: 'Emmerich', password: await bcrypt.hash('metalgear', 10)},
                    {username: 'Gray Fox', name: 'Frank', surname: 'Jaeger', password: await bcrypt.hash('foxhound', 10)},
                    {username: 'Dragon of Dojima', name: 'Kiryu', surname: 'Kazuma', password: await bcrypt.hash('tigerdrop', 10)}, 
                    {username: 'The Fire-Breathing Fist', name: 'Ken', surname: 'Masters', password: await bcrypt.hash('hadouken', 10)},
                    {username: '1st Class Soldier', name: 'Cloud', surname: 'Strife', password: await bcrypt.hash('777', 10)},
                    //{username: '', name: '', surname: '', password: await bcrypt.hash('', 10)},
                ]);

                await client.collection('transactions').insertMany([
                    {
                        createdBy: 'Solid Snake', category: 'Food', description: 'Ration',
                        cost: 10, quotes:[{contributors: 'Solid Snake', share: 10}] ,date: new Date(2005, 2, 3)
                    },
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
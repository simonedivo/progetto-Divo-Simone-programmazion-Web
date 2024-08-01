const { MongoClient } = require('mongodb');
const uri = 'mongodb://mongohost:';

let cachedDB;

module.exports = {
    connect: async () => {

        if (cachedDB) {
            return cachedDB;
        }

        try {
            const client = new MongoClient(uri, { useNewUrlParser: true });
            await client.connect();
            cachedDB = client.db();
            return cachedDB;
        } catch (error) {
            console.error('Error connecting to the database');
            throw error;
        }
    }
}

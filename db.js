const { MongoClient } = require('mongodb');

const dbName = "moments";
const dbUrl = "mongodb://localhost:27017";

let db;

async function getDb() {
    if (db == null) {
        const client = new MongoClient(url);
        await client.connect();
        db = client.db();
    }
    return db;
}

module.exports = { getDb };

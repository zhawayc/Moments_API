const { MongoClient } = require('mongodb');

//const dbUrl = "mongodb://localhost/moments";
const dbUrl = process.env.DB || "mongodb://localhost/moments";

let db;

async function getDb() {
    if (db == null) {
        const client = new MongoClient(dbUrl);
        await client.connect();
        db = client.db();
    }
    return db;
}

module.exports = { getDb };

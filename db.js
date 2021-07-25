const { MongoClient } = require('mongodb');

//const dbUrl = "mongodb://localhost/moments";
const dbUrl = "mongodb+srv://root:123a@cluster0.2alyx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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

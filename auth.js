const { getDb } = require("./db");

async function signin({username, password}) {
    const db = await getDb();
    let filter = {};
    filter.username = username;
    filter.password = password;
    const user = await db.collection("user").findOne(filter);
    if(user != undefined) {
        return user._id;
    }
    return;
}

async function signup({username, password}) {
    const db = await getDb();
    const user = await db.collection("user").findOne({username});
    if (user != undefined) {
        return;
    }
    const result = await db.collection("user").insertOne({username, password});
    return result.insertedId;
}

module.exports = { signin, signup }
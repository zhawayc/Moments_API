const { getDb } = require("./db");

async function signin({username, password}) {
    const db = await getDb();
    let filter = {};
    filter.username = username;
    filter.password = password;
    console.log(filter);
    const user = await db.collection("user").findOne(filter);
    if(user != undefined) {
        return true;
    }
    return false;
}

async function signup({username, password}) {
    const db = await getDb();
    const user = await db.collection("user").findOne({username});
    if (user != undefined) {
        return false;
    }
    await db.collection("user").insertOne({username, password});
    return true;
}

module.exports = { signin, signup }
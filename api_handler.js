const { ObjectId } = require('mongodb');
const { getDb } = require('./db.js');

async function about(){
    return "about!";
}

async function getStoriesByUserId( {userId} ) {
    const db = await getDb();
    const stories = await db.collection('story').find({userId}).toArray();
    return stories;
}

async function getStories() {
    const db = await getDb();
    const stories = await db.collection('story').find({}).toArray();
    return stories;
}

async function createStory({story}) {
    const db = await getDb();
    story.created = new Date();
    const result = await db.collection('story').insertOne(story);
    const savedStory = await db.collection('story').findOne({_id: result.insertedId});
    return savedStory;
}

async function updateStory({story}) {
    const db = await getDb();
    let { _id } = story;
    _id = new ObjectId(_id);
    await db.collection('story').updateOne({ _id }, { $set: { story } });
    const updatedStory = await db.collection('story').findOne({_id});
    return updatedStory;
}

async function deleteStory({_id}) {
    const db = await getDb();
    _id = new ObjectId(_id);
    const result = await db.collection('story').remove({_id});
    return true;
}

module.exports = { about, getStoriesByUserId, getStories, createStory, updateStory, deleteStory };
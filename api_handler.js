const { ObjectId } = require('mongodb');
const { getDb } = require('./db.js');

const PAGE_SIZE = 10;

async function about(){
    return "about!";
}

async function getStoriesByUserId( {userId, page} ) {
    const db = await getDb();
    const cursor = await db.collection('story').find({userId}).skip(PAGE_SIZE * (page - 1)).limit(PAGE_SIZE);
    let stories = await cursor.toArray();
    stories = getLikesForStories(stories);
    return { stories, page };
}

async function getStories({ page }) {
    const db = await getDb();
    const cursor = await db.collection('story').find({}).skip(PAGE_SIZE * (page - 1)).limit(PAGE_SIZE);
    let stories = await cursor.toArray();
    stories = getLikesForStories(stories);
    return { stories, page};
}

async function getLikesForStories(stories) {
    return stories.map(async element => (
        getLikeForStory(element)
    ));
}

async function getLikeForStory(story) {
    const db = await getDb();
    const num = await db.collection('like').findOne({_id: story._id});
    story.like = num == undefined ? 0 : num.like;
    return story;
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

async function likeStory({_id, userId}) {
    const db = await getDb();
    _id = new ObjectId(_id);
    userId = new ObjectId(userId);
    const result = await db.collection('story').findOne({_id});
    let likedBy = result["likedBy"];
    if (likedBy != undefined && likedBy.findIndex((id)=>(id.toHexString()==userId.toHexString())) != -1) {
        return false;
    }
    else if (likedBy == undefined) {
        likedBy = [userId];
    }
    else {
        likedBy.add(userId);
    }
    await db.collection('story').updateOne({ _id }, { $set: { likedBy } });
    await db.collection('like').update({ _id }, {$set: {"like": likedBy.length}}, {"upsert": true});
    return true;
}

module.exports = { about, getStoriesByUserId, getStories, createStory, updateStory, deleteStory, likeStory };
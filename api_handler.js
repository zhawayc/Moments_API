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
    stories = await getLikesForStories(stories);
    stories = await getAuthorsForStories(stories);
    return { stories, page};
}

async function getStoryById({_id}) {
    const db = await getDb();
    _id = new ObjectId(_id);
    const story = await db.collection('story').findOne({_id});
    return story;
}

async function getAuthorsForStories(stories) {
    return Promise.all(stories.map(async story => (
        getAuthorForStory(story)
    )));
}

async function getAuthorForStory(story) {
    const db = await getDb();
    const user = await db.collection('user').findOne({_id: new ObjectId(story.userId)});
    story.username = user.username;
    return story;
}

async function getLikesForStories(stories) {
    return Promise.all(stories.map(async element => (
        getLikeForStory(element)
    )));
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
    story._id = new ObjectId(story._id);
    const { _id, ...change} = story;
    await db.collection('story').updateOne({ _id }, { $set: {...change} });
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
        likedBy.push(userId);
    }
    await db.collection('story').updateOne({ _id }, { $set: { likedBy } });
    await db.collection('like').update({ _id }, {$set: {"like": likedBy.length}}, {"upsert": true});
    return true;
}

module.exports = { about, getStoriesByUserId, getStoryById, getStories, createStory, updateStory, deleteStory, likeStory };
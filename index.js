const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const fs = require('fs');
const { buildSchema } = require("graphql");
const { about, getStoriesByUserId, getStories, createStory, updateStory, deleteStory, likeStory, getStoryById } = require("./api_handler");
const { signin, signup } = require('./auth');

const PORT = process.env.PORT || 3000;
const app = express();

const schema = buildSchema(fs.readFileSync('schema.graphql', 'utf-8'));
const root = {
    about,
    getStoriesByUserId,
    getStoryById,
    getStories,
    createStory,
    updateStory,
    deleteStory,
    likeStory,
};

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    next();
}
app.use(allowCrossDomain)

app.get('/', (req, res) => {
    console.log("hello world");
    res.status(200).send(`<div>Hello World</div>`);
});

app.use(express.json());

app.post('/signin', async (req, res) => {
    const success = await signin(req.body);
    if (success != undefined) {
        res.status(200).send(success);
    }
    else {
        res.status(500).send("Username or Password is not correct.");
    }
});

app.post('/signup', async (req, res) => {
    const success = await signup(req.body);
    if (success != undefined ) {
        res.status(200).send(success);
    }
    else {
        res.status(500).send("The username already exists.");
    }
})

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

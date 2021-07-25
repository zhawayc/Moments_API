const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const fs = require('fs');
const { buildSchema } = require("graphql");
const { about, getStoriesByUserId, getStories, createStory, updateStory, deleteStory, likeStory } = require("./api_handler");
const { signin, login } = require('./auth');

const PORT = 3000;
const app = express();

const schema = buildSchema(fs.readFileSync('schema.graphql', 'utf-8'));
const root = {
    about,
    getStoriesByUserId,
    getStories,
    createStory,
    updateStory,
    deleteStory,
    likeStory,
};

app.get('/', (req, res) => {
    console.log("hello world");
    res.status(200).send(`<div>Hello World</div>`);
});

app.use(express.json());

app.post('/signin', async (req, res) => {
    const success = await signin(req.body);
    if (success == true) {
        res.status(200).send("Successful");
    }
    else {
        res.status(500).send("Username or Password is not correct.");
    }
});

app.post('/login', async (req, res) => {
    const success = await login(req.body);
    if (success == true) {
        res.status(200).send("Successful");
    }
    else {
        res.status(500).send("The username already exists.");
    }
})

app.post('/login', (req, res) => {
    console.log(req.body);
});

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

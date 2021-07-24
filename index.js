const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const fs = require('fs');
const { buildSchema } = require("graphql");
const { about, getStories, createStory, updateStory, deleteStory } = require("./api_handler");

const PORT = 3000;
const app = express();

const schema = buildSchema(fs.readFileSync('schema.graphql', 'utf-8'));
const root = {
    about,
    getStories,
    createStory,
    updateStory,
    deleteStory,
};

app.get('/', (req, res) => {
    console.log("hello world");
    res.status(200).send(`<div>Hello World</div>`);
});

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

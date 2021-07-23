const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');
const { about } = require('./api_resolver.js');

const resolvers = {
    Query: {
        about
    }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
    resolvers
});

function installHandler(app) {
    server.applyMiddleware({app, path: '/graphql'});
}

module.exports = { installHandler };

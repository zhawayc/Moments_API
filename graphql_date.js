const { GraphQLScalarType, Kind } = require('graphql');
const { Kind } = require('graphql/language');

const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL is a scalar',
    serialize(value){
        return value.toISOString();
    },
    parseValue(value) {
        const dateValue = new Date(value);
        return Number.isNaN(dateValue) ? undefined : dateValue;
    },
    parseLiteral(ast) {
        if(ast.kind === Kind.STRING) {
            const dateValue = new Date(value);
            return Number.isNaN(dateValue) ? undefined : dateValue;
        }
        return undefined;
    }
});

module.exports = GraphQLDate;

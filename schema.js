require('dotenv').config()

const {
    GraphQLObjectType,
    GraphQLSchema,
} = require('graphql');

const {messageQueryFields} = require('./message/graphQL')
const {contactQueryFields} = require('./contact/graphQL')
const {userQueryFields} = require('./user/graphQL')
const {tagQueryFields} = require('./tags/graphQL')

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        ...messageQueryFields,
        ...contactQueryFields,
        ...userQueryFields,
        ...tagQueryFields
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
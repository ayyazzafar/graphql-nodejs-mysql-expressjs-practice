const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');
const {getTags, getTag} = require('./model')

const tagTableFields = {
    id: {type: GraphQLInt},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    password: {type: GraphQLString},
    token: {type: GraphQLString},
    account: {type: GraphQLInt},
    company: {type: GraphQLString},
    role_id: {type: GraphQLInt},
    mobile: {type: GraphQLString},
    defaultAccountNumber: {type: GraphQLString},
    integration_code: {type: GraphQLString},
    notificationSound: {type: GraphQLString},
    emailConfirmationCode: {type: GraphQLString},
  };

  /**
 * For Tag Conditions
 */
const TagInputFields = new GraphQLInputObjectType({
    name: "TagFieldsObject",
    fields: ()=>(tagTableFields),
    description: "This object contains fields form tag table in database."
});

const TagInputConditionsType = new GraphQLInputObjectType({
    name:  'TagConditionsObject',
    fields: ()=>({
        fields: {type: TagInputFields}
    }),
    description: 'This object would contain all available conditions for tags table.'
});

const TagType = new GraphQLObjectType({
    name: "Tag",
    fields: ()=>(tagTableFields),
    description: "Tag Object",

});


const tagQueryFields = {
    tag: {
        type: TagType,
        args: {
            id: {type: GraphQLInt},
        }, 
        resolve(parentValue, args){
            return getTag(args)
        }, 
        description: "Returns only single tag."
    },
    tags: {
        type: new GraphQLList(TagType),
        args: {
           limit: {type: GraphQLInt},
           conditions: { type: TagInputConditionsType }
        },
        resolve(parentValue, args){
            return getTags(args);
        },
        description: "Returns all tags depending on your provided conditions."
    }
}


module.exports.tagQueryFields = tagQueryFields
module.exports.TagType = TagType
module.exports.TagInputConditionsType = TagInputConditionsType
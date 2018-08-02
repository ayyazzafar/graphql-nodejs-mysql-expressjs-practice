const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');
const {getUsers, getUser} = require('./model')

const userTableFields = {
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
 * For User Conditions
 */
const UserInputFields = new GraphQLInputObjectType({
    name: "UserFieldsObject",
    fields: ()=>(userTableFields),
    description: "This object contains fields form user table in database."
});

const UserInputConditionsType = new GraphQLInputObjectType({
    name:  'UserConditionsObject',
    fields: ()=>({
        fields: {type: UserInputFields}
    }),
    description: 'This object would contain all available conditions for users table.'
});

const UserType = new GraphQLObjectType({
    name: "User",
    fields: ()=>(userTableFields),
    description: "User Object",

});


const userQueryFields = {
    user: {
        type: UserType,
        args: {
            id: {type: GraphQLInt},
        },
        resolve(parentValue, args){
            return getUser(args)
        },
        description: "Returns only single user."
    },
    users: {
        type: new GraphQLList(UserType),
        args: {
           limit: {type: GraphQLInt},
           conditions: { type: UserInputConditionsType }
        },
        resolve(parentValue, args){
            return getUsers(args);
        },
        description: "Returns all users depending on your provided conditions."
    }
}


module.exports.userQueryFields = userQueryFields
module.exports.UserType = UserType
module.exports.UserInputConditionsType = UserInputConditionsType
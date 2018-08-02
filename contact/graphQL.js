const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');
const {getContacts, getContact} = require('./model')
const {TagType} = require('../tags/graphQL')
const {getTags} = require('../tags/model')

const contactTableFields = {
    id: {type: GraphQLInt},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    number: {type: GraphQLString},
    user: {type: GraphQLInt},
    date_updated: {type: GraphQLString},
    date_created: {type: GraphQLString},
    account: {type: GraphQLInt},
    integration_id: {type: GraphQLInt},
    integration_updated: {type: GraphQLString},
    integration_type: {type: GraphQLString},
    integration_unique_index: {type: GraphQLString},
    defaultContact: {type: GraphQLInt},
  };

  /**
 * For Contact Conditions
 */
const ContactInputFields = new GraphQLInputObjectType({
    name: "ContactFieldsObject",
    fields: ()=>(contactTableFields),
    description: "This object contains fields form contacts table in database."
});

const ContactInputConditionsType = new GraphQLInputObjectType({
    name:  'ContactConditionsObject',
    fields: ()=>({
        fields: {type: ContactInputFields}
    }),
    description: 'This object would contain all available conditions for contacts table.'
});

const ContactType = new GraphQLObjectType({
    name: "Contact",
    fields: ()=>({...contactTableFields,
    tags: { 
        type: new GraphQLList(TagType),
        resolve: (contact)=>{
            return getTags({conditions: {contact_id: contact.id}});
        }
    }
    }),
    description: "Contact Object",

});


const contactQueryFields = {
    contact: {
        type: ContactType,
        args: {
            id: {type: GraphQLString},
        },
        resolve(parentValue, args){
            return getContact(args)
        },
        description: "Returns only single contact."
    },
    contacts: {
        type: new GraphQLList(ContactType),
        args: {
           limit: {type: GraphQLInt},
           conditions: { type: ContactInputConditionsType }
        },
        resolve(parentValue, args){
            return getContacts(args);
        },
        description: "Returns all contacts depending on your provided conditions."
    }
}


module.exports.contactQueryFields = contactQueryFields
module.exports.ContactType = ContactType
module.exports.ContactInputConditionsType = ContactInputConditionsType
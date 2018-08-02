const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');
const {mysqlConnection} = require('../database');
const {getContacts, getContact} = require('../contact/model')
const {ContactType, ContactInputConditionsType} = require('../contact/graphQL')
const {getTotalMessagesInConversation} = require('./model')

const messageTableFields = {
    id: {type: GraphQLInt},
    date_updated: {type: GraphQLString},
    date_created: {type: GraphQLString},
    date_sent: {type: GraphQLString},
    body: {type: GraphQLString},
    sid: {type: GraphQLString},
    sent_to: {type: GraphQLString},
    sent_from: {type: GraphQLString},
    status: {type: GraphQLString},
    twilio_date_created: {type: GraphQLString},
    account_sid: {type: GraphQLString},
    messaging_service_sid: {type: GraphQLString},
    num_segments: {type: GraphQLString},
    user: {type: GraphQLInt},
    num_media: {type: GraphQLString},
    direction: {type: GraphQLString},
    api_version: {type: GraphQLString},
    price: {type: GraphQLString},
    price_unit: {type: GraphQLString},
    error_code: {type: GraphQLString},
    error_message: {type: GraphQLString},
    uri: {type: GraphQLString},
    media_uri: {type: GraphQLString},
    OurNumber: {type: GraphQLString},
    TheirNumber: {type: GraphQLString},
    ToCountry: {type: GraphQLString},
    ToState: {type: GraphQLString},
    ToCity: {type: GraphQLString},
    ToZip: {type: GraphQLString},
    FromCountry: {type: GraphQLString},
    FromState: {type: GraphQLString},
    FromCountry: {type: GraphQLString},
    FromCity: {type: GraphQLString},
    FromZip: {type: GraphQLString},
    scheduled_time: {type: GraphQLString},
    sent_id: {type: GraphQLInt},
    tag: {type: GraphQLInt},
    group_link: {type: GraphQLInt},
    account: {type: GraphQLInt},
    needles_synced: {type: GraphQLInt},
    integration_id: {type: GraphQLInt},
    media_uri1: {type: GraphQLString},
    media_uri2: {type: GraphQLString},
    media_uri3: {type: GraphQLString},
    media_uri4: {type: GraphQLString},
    media_uri5: {type: GraphQLString},
    media_uri6: {type: GraphQLString},
    media_uri7: {type: GraphQLString},
    media_uri8: {type: GraphQLString},
    media_uri9: {type: GraphQLString},
  };

  /**
 * For Message Conditions
 */
const MessageInputFields = new GraphQLInputObjectType({
    name: "MessageFieldsObject",
    fields: ()=>(messageTableFields),
    description: "This object contains fields form messages table in database."
});

const MessageInputConditionsType = new GraphQLInputObjectType({
    name:  'MessageConditionsObject',
    fields: ()=>({
        fields: {type: MessageInputFields}
    }),
    description: 'This object would contain all available conditions for messages table.'
});

const MessageType = new GraphQLObjectType({
    name: "Message",
    fields: ()=>({
        ...messageTableFields,
        totalMessages: {
            type: GraphQLInt,
            description: "This would return total number of messages for current conversation",
            resolve: (message, args)=>{
                return getTotalMessagesInConversation(message.OurNumber, message.TheirNumber);
            }
        },
        contacts: {
            args: {
                limit: {type: GraphQLInt}, conditions: {type: ContactInputConditionsType}
            },
            type: GraphQLList(ContactType), 
            description: "Returns all contacts of the account related to current message.",
            resolve: (message, args) => {

                let options = {};
                if(!args || (args && !args.conditions)){
                    options = {conditions: {fields: {account: message.account}}}
                } else {
                    options = args
                }
                console.log(args)
                options.limit = !args.limit?20:args.limit;

                //console.log(options);

                return getContacts(options); 
            }
        },
        contact: {
            args: {
                conditions: {type: ContactInputConditionsType}
            },
            type: ContactType, 
            description: "Return contact object from TheirNumber of current message.",
            resolve: (message, args) => {

                let options = {};
                if(!args || (args && !args.conditions)){
                    options = {conditions: {fields: {number: message.TheirNumber}}}
                } else {
                    options = args
                }

                return getContact(options);
            }
        }
    }),
    description: "Message Object"
});


const messageQueryFields = {
    message: {
        type: MessageType,
        args: {
            id: {type: GraphQLInt},
        },
        resolve(parentValue, args){
         
            return new Promise((resolve, reject)=>{
                args = {conditions: {fields: {id: args.id}}}
                let limit = args.limit?('limit '+args.limit):'';
                let conditions = [];

                if(args.conditions){
                    if(args.conditions.fields){
                        for(let key in args.conditions.fields ){
                            console.log(key);
                            conditions.push(`${key}=${mysqlConnection.escape(args.conditions.fields[key])}`);
                        } 
                    } 
                    
                }

                const conditionsStr = conditions.length? (' where ' + conditions.join( ' and ')) : ''

                mysqlConnection.query(`SELECT * FROM messages ${conditionsStr} ${limit}`, function (err, result, fields) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result[0]);
                    }
                    
                  });
            });
        },
        description: "Returns only single message."
    },
    messages: {
        type: new GraphQLList(MessageType),
        args: {
           limit: {type: GraphQLInt},
           conditions: { type: MessageInputConditionsType }
        },
        resolve(parentValue, args){
            return new Promise((resolve, reject)=>{

                let limit = args.limit?('limit '+args.limit):'';
                let conditions = [];

                if(args.conditions){
                    if(args.conditions.fields){
                        for(let key in args.conditions.fields ){
                            console.log(key);
                            conditions.push(`${key}=${mysqlConnection.escape(args.conditions.fields[key])}`);
                        } 
                    } 
                    
                }

                const conditionsStr = conditions.length? (' where ' + conditions.join( ' and ')) : ''

                mysqlConnection.query(`SELECT * FROM messages ${conditionsStr} ${limit}`, function (err, result, fields) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                    
                  });
            });
           
        },
        description: "Returns all messages depending on your provided conditions."
    }
}

module.exports = {
    messageQueryFields
}
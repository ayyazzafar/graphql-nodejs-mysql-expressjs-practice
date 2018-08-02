const express = require('express');
const expressGraphQL = require('express-graphql');
const app  = express();
const schema = require('./schema');
require('dotenv').config()
app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}))

app.listen(4000, ()=>{

    console.log('started')

});
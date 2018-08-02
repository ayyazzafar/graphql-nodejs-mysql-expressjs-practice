const {mysqlConnection} = require('../database');

module.exports.getTotalMessagesInConversation=(OurNumber, TheirNumber) => {


            return new Promise((resolve, reject)=>{
             
                const conditions=[];
                conditions.push(`OurNumber=${mysqlConnection.escape(OurNumber)}`);
                conditions.push(`TheirNumber=${mysqlConnection.escape(TheirNumber)}`);
                const conditionsStr = conditions.length? (' where ' + conditions.join( ' and ')) : ''
                console.log(`SELECT count(messages.id) as totalMessages FROM messages  ${conditionsStr} and status != 'schedule`);
                mysqlConnection.query(`SELECT count(messages.id) as totalMessages FROM messages  ${conditionsStr} and  status <> 'ready' and status <> 'scheduled' `, function (err, result, fields) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result[0].totalMessages);
                    }
                    
                  });
            }); 
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

}
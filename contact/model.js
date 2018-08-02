const {mysqlConnection} = require('../database');

module.exports.getContacts = (args)=>{
    return new Promise((resolve, reject)=>{

        let limit = args.limit?('limit '+args.limit):'';
        let conditions = [];

        if(args.conditions){
            if(args.conditions.fields){
                for(let key in args.conditions.fields ){
                   // console.log(key);
                    conditions.push(`${key}=${mysqlConnection.escape(args.conditions.fields[key])}`);
                } 
            } 
            
        }

        const conditionsStr = conditions.length? (' where ' + conditions.join( ' and ')) : ''

        mysqlConnection.query(`SELECT * FROM contacts ${conditionsStr} ${limit}`, function (err, result, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
            
          });
    });
}


module.exports.getContact = (args)=>{
    return new Promise((resolve, reject)=>{

        let limit = args.limit?('limit '+args.limit):'';
        let conditions = [];

        if(args.conditions){
            if(args.conditions.fields){
                for(let key in args.conditions.fields ){
                   // console.log(key);
                    conditions.push(`${key}=${mysqlConnection.escape(args.conditions.fields[key])}`);
                } 
            } 
            
        }

        const conditionsStr = conditions.length? (' where ' + conditions.join( ' and ')) : ''

        mysqlConnection.query(`SELECT * FROM contacts ${conditionsStr} ${limit}`, function (err, result, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
            
          });
    });
}
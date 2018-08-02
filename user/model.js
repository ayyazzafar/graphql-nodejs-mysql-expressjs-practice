const {mysqlConnection} = require('../database');

module.exports.getUsers = (args)=>{
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

        mysqlConnection.query(`SELECT * FROM user ${conditionsStr} ${limit}`, function (err, result, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
            
          });
    }); 
}


module.exports.getUser = (args)=>{
    return new Promise((resolve, reject)=>{

        args.conditions = {fields: {id: args.id}};

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

        mysqlConnection.query(`SELECT * FROM user ${conditionsStr} ${limit}`, function (err, result, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
            
          });
    });
}
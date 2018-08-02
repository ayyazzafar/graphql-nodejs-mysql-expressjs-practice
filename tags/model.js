const {mysqlConnection} = require('../database');

module.exports.getTags = (args)=>{
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

        mysqlConnection.query(`SELECT * FROM tags ${conditionsStr} ${limit}`, function (err, result, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
            
          });
    }); 
}


module.exports.getTag = (args)=>{
    return new Promise((resolve, reject)=>{
        if(args.id){
            args.conditions = {fields: {id: args.id}};
        }
        

        let limit = args.limit?('limit '+args.limit):'';
        let conditions = [];

        if(args.conditions){
            if(args.conditions.fields){
                for(let key in args.conditions.fields ){
                   // console.log(key);
                    conditions.push(`${key}=${mysqlConnection.escape(args.conditions.fields[key])}`);
                } 
            } 
            console.log('testtest');
            console.log(args);
            if(args.conditions.contact_id){
                conditions.push(`(tags.id in (select tag_associations.tag_id from tag_associations where tag_associations.contact_id = ${args.conditions.contact_id}))`);
            }
            
        }
        

        const conditionsStr = conditions.length? (' where ' + conditions.join( ' and ')) : ''
        console.log(`SELECT * FROM tags ${conditionsStr} ${limit}`);
        mysqlConnection.query(`SELECT * FROM tags ${conditionsStr} ${limit}`, function (err, result, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
            
          });
    });
}
var log = new (require('./log.js'))();
var config = require('../config.js');
log.setLoggingLevel(config.logging_levels.database);

var sqlite3 = require('sqlite3').verbose();
var db;

var logging_prefix = 'Database SQLite Driver';

function init (){
    log.setLoggingLevel(0);

    db = new sqlite3.Database('db.sqlite');
}
exports.init = init;
function replaceConditionChars (conditions){
    conditions = conditions.replace('!=', 'is NOT');
    return conditions;
}
function parseConditions(conditions){
    var conditions_str = '';
    conditions.forEach(function(el){
        var con = replaceConditionChars(el);
        conditions_str += con + ' AND ';
    });
    conditions_str = conditions_str.slice(0, -4);
    conditions_str = 'WHERE ' + conditions_str;
    return conditions_str;
}

function parseFields(fields){
    var fieldTypes = {
        bool: 'INTEGER',
        int: 'INTEGER',
        string: 'VARCHAR',
        timestamp: 'TIMESTAMP'
    };
    var fieldsString = "";
    fields.forEach(function(el){
        var n = el.name;
        var t = fieldTypes[el.type] != undefined ? fieldTypes[el.type] : el.type;
        var sz = el.size != undefined ? "("+el.size+")" : "";
        var ai = el.ai ? "PRIMARY KEY " : "";
        var _n = el._null ? " NULL " : " NOT NULL";
        var d = (el.default != undefined ? "DEFAULT " + (el.default == "timestamp" ? "CURRENT_TIMESTAMP" : el.default) : "");
        var u = el.unique ? "UNIQUE" : "";
        var p = el.primary != undefined ? "AUTOINCREMENT" : "";
        
        sz = (sz == "(MAX)" ? "65535" : sz);

        fieldsString += "["+n+"] " + t + sz + " " + d + " " + u + " " + _n + " " + ai + p + ", ";
    });
    fieldsString = fieldsString.slice(0, -2);

    return fieldsString;
}

function select(table, select, callback, conditions){
    if(table == undefined || select == undefined){
        log.error('Table and Select parameters from select call must be defined!', config.logging_prefixes.database);
        return;
    }
    var conditions_str = '';
    if(conditions != undefined){
        conditions_str = parseConditions(conditions);
    }else {
        conditions_str = '';
    }

    db.serialize(function() {
        var query = "SELECT "+select+" FROM "+table+" "+conditions_str;
        log.info('Executing query: ' + query, config.logging_prefixes.database);
        db.all(query, function(err, rows) {
            if(err != undefined && err != null){
                if(callback != null)
                    callback({error: true, msg: err});
            }else{
                if(callback != null)
                    callback({error: false, msg: '', data: rows});
            }
        });
    });
}
exports.select = select;
/*[{col: 'username', value: 'bob'}, {col: 'password', value: 'IAmCool'}]*/
function parseInsertFields(fields){
    var fieldString = '(';
    var valueString = '(';

    fields.forEach(function(el){
        fieldString += '`' + el.col + '`, ';
        valueString += '\'' + el.value + '\', ';
    });
    fieldString = fieldString.slice(0, -2) + ')';
    valueString = valueString.slice(0, -2) + ')';

    return fieldString + ' VALUES ' + valueString;
}

function insert (table, values, callback){
    db.serialize(function() {
        var query = "INSERT INTO " + table + " " + parseInsertFields(values);
        log.info('Executing query: ' + query, config.logging_prefixes.database);
        db.run(query, function(err){
            if(err != null && err != undefined){
                log.error('Error while inserting: ' + err, config.logging_prefixes.database);
            }else {
                //console.log('changes: ' + JSON.stringify(this));
                if(callback != undefined)
                    callback(this.lastID);
            }
        });
    });
}
exports.insert = insert;

function check(table, callback){
    select('sqlite_master', '*', function(result){
        //console.log(result);
        if(result.data.length <= 0){
            log.info("Table " + table + " does not exist", config.logging_prefixes.database);
            if(callback != null)
                callback(false);
        }else{
            log.success("Table " + table + " exists", config.logging_prefixes.database);
            if(callback != null)
                callback(true);
        }    
    }, ["type='table'", "name='"+table+"'"]);
}
exports.check = check;

function create (table, fields, callback){
    db.serialize(function() {
        var rows = [];
        var query = "CREATE TABLE IF NOT EXISTS " + table + " ("+parseFields(fields)+")";
        log.info('Executing query: ' + query, config.logging_prefixes.database);
        db.run(query, function(err) {
            if(err != undefined && err != null){
                if(callback != null)
                    callback({error: true, msg: err});
            }else{
                if(callback != null)
                    callback({error: false, msg: ''});
            }
        });
    });

}
exports.create = create;

function del (table, callback, conditions){
    var conditions_str = '';
    if(conditions != undefined){
        console.log(conditions);
        conditions_str = parseConditions(conditions);
    }else {
        conditions_str = '';
    }
    var query = "DELETE FROM "+table+" " + conditions_str;
    log.info('Executing query: ' + query, config.logging_prefixes.database);
    db.run(query, function(err){
        if(err != null && err != undefined){
            log.error('Error while deleting: ' + err, config.logging_prefixes.database);
        }else {
            if(callback != undefined)
                callback();
        }
    });

}
exports.del = del;
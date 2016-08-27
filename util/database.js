var log = new (require('./log.js'))();
var config = require('../config.js');

var sqlite = require('./sqlite.js');
var mysql = require('./mysql.js')

var db;

function init(callback){
    if(config.database_type == 'sqlite'){
        log.info('Database type set to SQLite', config.logging_prefixes.database);
        log.info('Opening SQLite connection...', config.logging_prefixes.database);
        sqlite.init();
        log.success('Opened SQLite connection!', config.logging_prefixes.database);
        db = sqlite;
        callback();
    }else if (config.database_type == 'mysql'){
        mysql.init();
        db = mysql;
    }
}
exports.init = init;

//Table: string
//Select: string - can be anything from * to col, col, col
//Conditions: array of conditions that must be met - e.g ['enddate != null']
//      things such as != will be translated by the driver (e.g sqlite: 'is NOT' null)
//Returns: {error: false, msg: '', data: [..data..]}
function select(table, select, callback, conditions){
    db.select(table, select, callback, conditions);
}
exports.select = select;

//Table: string
//Fields: [{name: 'id', ai: true, null: false, default: '', type: 'int'}]
//Checks if the sepecified database exists, and if not it's created
function check(table, callback){
    db.check(table, callback);
}
exports.check = check;

//Table: string
//Fields: [{name: 'id', ai: true, null: false, default: '', type: 'int'}]
//Create the sepecified database
function create(table, fields, callback){
    db.create(table, fields, callback);
}
exports.create = create;

//Table: string
//Values: [{col: 'username', value: 'bob'}, {col: 'password', value: 'IAmCool'}]
//Conditions: array of conditions that must be met - e.g ['enddate != null']
//      things such as != will be translated by the driver (e.g sqlite: 'is NOT' null)
//Inserts data into the database
function insert(table, values, callback){
    db.insert(table, values, callback);
}
exports.insert = insert;

//Table: string
//Conditions: array of conditions that must be met - e.g ['enddate != null']
//      things such as != will be translated by the driver (e.g sqlite: 'is NOT' null)
//Inserts data into the database
function del(table, callback, conditions){
    db.del(table, callback, conditions);
}
exports.del = del;
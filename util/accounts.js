var db = require('./database.js');
var config = require('../config.js');
var log = new (require('./log.js'))();
var bcrypt   = require('bcrypt-nodejs');

var fields = [
    {name: 'id', ai: true, _null: false, type: 'int', key: true, primary: true},
    {name: 'username', _null: false, type: 'string', size: 25, unique: true},
    {name: 'displayname', _null: true, type: 'string', size: 60, unique: true},
    {name: 'email', _null: true, type: 'string', size: 80, unique: true},
    {name: 'password', _null: false, type: 'string', size: 60},
    {name: 'registered', _null: false, default: 'timestamp', type: 'timestamp'},
    {name: 'lastlogin', _null: false, default: 'timestamp', type: 'timestamp'}
]

function init(callback){
    db.check(config.tables.accounts, function(exists){
        if(!exists){
            db.create(config.tables.accounts, fields, function(result){
                if(result.err){
                    log.error('Error when creating \'' + config.tables.accounts +'\' table! ' + result.msg, config.logging_prefixes.accounts);
                }
                create(config.default_admin_username, config.default_admin_password);
                //updateAccoutList(function(){
                callback();    
                //});
            });
        }else{
            updateAccoutList();
            //updateAccoutList(function(){
            callback();    
            // });
        }
    });
}
exports.init = init;

function User (id, username, displayname, email, password) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;

    this.passwordMatch = function(pass){
        //    return pass == password;
        return bcrypt.compareSync(pass, password);
    }

    this.save = function(){

    }
}

function create(username, password, callback){
    db.insert(config.tables.accounts, [
        {col: 'username', value: username},
        {col: 'password', value:  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)},
    ], function(insertedID){
        log.success('Created accounts ' + username + '!', config.logging_prefixes.accounts);
        if(callback != undefined){
            findId(insertedID, function(err, user){
                callback(user); 
            });
        }
    })
}
exports.create = create;

function findId(userid, callback){
    db.select(config.tables.accounts, '*', function(result){
        if(result.err){
            log.error('Error when user! ' + result.msg, config.logging_prefixes.accounts);
            callback(result, false);
        }else{
            if(result.data.length <= 0){
                callback(null, false);
            }else{
                var d = result.data[0];
                var user = new User(d.id, d.username, d.displayname, d.email, d.password);
                callback(null, user);
            }
        }
    }, ['id = '+userid]);
}
exports.findId = findId;

function findOne(username, callback){
    db.select(config.tables.accounts, '*', function(result){
        if(result.err){
            log.error('Error when user! ' + result.msg, config.logging_prefixes.accounts);
            callback(result, false);
        }else{
//            console.log(JSON.stringify(result));
            if(result.data.length <= 0){
                callback(null, false);
            }else{
                var d = result.data[0];
                var user = new User(d.id, d.username, d.displayname, d.email, d.password);
                callback(null, user);
            }
        }
    }, ['username = \''+username+'\'']);
}
exports.findOne = findOne;


function list (callback){
    db.select(config.tables.accounts, 'id, username, displayname, email', function(result){
        if(result.err){
            log.error('Error when getting account list! ' + result.msg, config.logging_prefixes.accounts);
            callback(undefined);
        }else{
            callback(result.data);
        }
    });
}
exports.list = list;

function updateAccoutList(callback){
    list(function(result){
        exports.accounts = result;
        log.success('Updated accounts list',config.logging_prefixes.projects);
        if(callback != undefined)
            callback();
    });
}
//
//function has (username){
//    //    exports.accounts.forEach(function(el){
//    //       if(el.username.toLowerCase() == username.toLowerCase()) 
//    //           return true;
//    //    });
//    for(var i = 0; i < exports.accounts.length; ++i){
//        if(exports.accounts[i].username.toLowerCase() == username.toLowerCase())    
//            return true;
//    }
//    return false;
//}
//exports.has = has;
//
//function get (userid, callback){
//    db.select(config.tables.accounts, 'id, username, displayname, email', function(result){
//        if(result.err){
//            log.error('Error when getting account list! ' + result.msg, config.logging_prefixes.accounts);
//            callback(undefined);
//        }else{
//            callback(result.data);
//        }
//    }, ['id = '+userid]);
//}
//exports.get = get;
//
//function password(username, password, callback){
//    db.select(config.tables.accounts, 'password', function(result){
//        if(result.err){
//            log.error('Error when getting account password! ' + result.msg, config.logging_prefixes.accounts);
//            callback(false);
//        }else{
//            console.log(result.data);
//            if(result.data[0].password == password)
//                callback(true);
//            else
//                callback(false);
//        }
//    }, ['username = \''+username+'\'']);
//}
//exports.password = password;
//function updateAccoutList(callback){
//    list(function(result){
//        exports.accounts = result;
//        log.success('Updated accounts list',config.logging_prefixes.projects);
//        if(callback != undefined)
//            callback();
//    });
//}
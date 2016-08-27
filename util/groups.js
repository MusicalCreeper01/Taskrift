var db = require('./database.js');
var config = require('../config.js');
var log = new (require('./log.js'))();

var fieldsGroups = [
    {name: 'id', ai: true, _null: false, type: 'int', key: true, primary: true},
    {name: 'name', _null: false, type: 'string', size: 25, unique: true}
]
var tableGroups = config.tables.groups;

var fieldsMemberships = [
    {name: 'id', ai: true, _null: false, type: 'int', key: true, primary: true},
    {name: 'group', _null: false, type: 'int'},
    {name: 'user', _null: false, type: 'int'}
]
var tableMemberships = config.tables.memberships;

function check_group_table(callback){
    db.check(tableGroups, function(exists){
        if(!exists){
            db.create(tableGroups, fieldsGroups, function(result){
                if(result.err){
                    log.error('Error when creating \'' + tableGroups +'\' table! ' + result.msg, config.logging_prefixes.groups);
                }
                var i = 0;
                config.user_groups.forEach(function(el){
                    create(el, function(){
                        ++i;
                        if(i == config.user_groups.length){
                            updateGroupList(function(){
                                callback();
                            });
                        }
                    }, false);

                });
            });
        }else{
            callback();
        }
    });
}

function check_membership_table(callback){
    db.check(tableMemberships, function(exists){
        if(!exists){
            db.create(tableMemberships, fieldsMemberships, function(result){
                if(result.err){
                    log.error('Error when creating \'' + fieldsMemberships +'\' table! ' + result.msg, config.logging_prefixes.groups);
                }
                //We can safely assume that user id 1 is the admin user, since if the tables are just being created it should be the first entry.
                addgroup(1, config.default_admin_group, function(){
                    updateGroupList();
                    callback();
                });
            });
        }else{
            callback();
        }
    });
}

function init(callback){
    check_group_table(function(){
        check_membership_table(function(){
            updateGroupList(function(){
               callback(); 
            });
        });
    });
}
exports.init = init;

function create(name, callback, update){
    db.insert(tableGroups, [
        {col: 'name', value: name}
    ], function(){
        log.success('Created group ' + name + '!', config.logging_prefixes.groups);
        if(update != undefined)
            if(update != false)
                updateGroupList();
        if(callback != undefined)
            callback();
    })
}

function list (callback){
    db.select(tableGroups, '*', function(result){
        if(result.err){
            log.error('Error when getting group list! ' + result.msg, config.logging_prefixes.groups);
            callback(undefined);
        }else{
            callback(result.data);
        }
    });
}
exports.list = list;

function addgroup (userid, groupid, callback){
    db.insert(tableMemberships, [
        {col: 'group', value: groupid},
        {col: 'user', value: userid}
    ], function(){
        log.success('Added user id ' + userid + ' to group id '+groupid+'!', config.logging_prefixes.groups);
        updateGroupList();
        if(callback != undefined)
            callback();
    })
}
exports.addgroup = addgroup;

function removegroup (userid, groupid, callback){
    db.del(tableMemberships, function(){
        log.success('Deleted group link: user id ' + userid + ' to group id '+groupid+'!', config.logging_prefixes.groups);
        updateGroupList();
        if(callback != undefined)
            callback();
    }, ['[user] = \'' + userid + '\'', '[group] = \'' + groupid + '\''])
}
exports.removegroup = removegroup;

function updateGroupList(callback){
    list(function(result){
        exports.groups = result;
        log.success('Updated groups list',config.logging_prefixes.groups);
        if(callback != undefined)
            callback();
    });
}
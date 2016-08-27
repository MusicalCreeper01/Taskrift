var db = require('../../util/database.js');
var config = require('../../config.js');
var log = new (require('../../util/log.js'))();
log.setLoggingLevel(config.logging_levels.apps);

var prefix = config.logging_prefixes.apps + ':Tasks';

var table = 'tasks';
var fields = [
    {name: 'id', ai: true, _null: false, type: 'int', key: true, primary: true},
    {name: 'title', _null: false, type: 'string', size: 25},
    {name: 'desc', _null: true, type: 'string', size: 120},
    {name: 'completed', _null: false, type: 'bool', default: '0', size: 1},
    {name: 'project', _null: true, type: 'int'},
    {name: 'created', _null: false, default: 'timestamp', type: 'timestamp'},
];

exports.init = function (callback){
    db.check(table, function(exists){
        if(!exists){
            db.create(table, fields, function(result){
                if(result.err){
                    log.error('Error when creating \'' + table +'\' table! ' + result.msg, prefix);
                }
                updateTaskList(function(){
                    callback();
                });
            });
        }else{
            updateTaskList(function(){
                callback();
            });
        }
    });
}

exports.add = function (name, desc, project, callback){
    db.insert(table, [
        {col: 'title', value: name},
        {col: 'desc', value:  desc},
        {col: 'project', value:  project},
    ], function(insertedId){
        log.success('Created task ' + name + '!', prefix);
        updateTaskList(function(){
            if(callback != undefined)
                callback(insertedId); 
        });
    })
}

exports.delete = function(id, callback) { 
    db.del(table, function(){
        log.success('Deleted task ' + id, prefix);
        updateTaskList(function(){
            if(callback != undefined)
                callback(); 
        });
    }, ['[id] = \'' + id + '\''])
}

exports.list = function (callback){
    db.select(table, '*', function(result){
        if(result.err){
            log.error('Error getting task list ' + result.msg, prefix);
        }
        if(callback != null)
            callback(result.data);
    })
}

exports.get = function(project, callback){
    db.select(table, '*', function(result){
        if(result.err){
            log.error('Error when getting tasks for project #' + project, prefix);
        }
        if(callback != null)
            callback(result.data);
    }, ['project = ' + project])
}

exports.getRow = function(id, callback){
    db.select(table, '*', function(result){
        if(result.err){
            log.error('Error when getting tasks for project #' + project, prefix);
        }
        if(callback != null)
            callback(result.data);
    }, ['id = ' + id])
}

exports.getSync = function(project){
    var tasks = [];
    log.info('tasks: ' + JSON.stringify(exports.tasks), prefix);
    exports.tasks.forEach(function(el){
        if(el.project == project)
            tasks.push(el);
    });
    return tasks;
}

var displayIndex = -1;
function updateTaskList(callback){
    exports.list(function(result){
        exports.tasks = result;
        
        var t = {
            main: exports.tasks.length,
            secondary: 'Task(s)',
            size: 1
        };
        
        if(displayIndex == -1){
            require('../../util/apps').apps['dashboard'].displayText(t, function(id){
                displayIndex = id;
            });
        }else{
            require('../../util/apps').apps['dashboard'].displayText2(displayIndex, t, function(id){
                displayIndex = id;
            });
        }
        
        
        log.info('Updated task list! ', prefix);
        if(callback != undefined)
            callback();
    });
}
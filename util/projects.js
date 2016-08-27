var db = require('./database.js');
var config = require('../config.js');
var log = new (require('./log.js'))();

var fs = require('fs');

var app = require('../app/apps');

//http://lollyrock.com/articles/express4-file-upload/
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

var uuid = require('node-uuid');

var fields = [
    {name: 'id', ai: true, _null: false, type: 'int', key: true, primary: true},
    {name: 'name', _null: false, type: 'string', size: 25, unique: true},
    {name: 'created', _null: false, default: 'timestamp', type: 'timestamp'},
    {name: 'image', _null: true, type: 'string', size: 'MAX', default: 'default.png'}
]

function init(callback){
    app.post('/projects/add', upload.single('project-image'), function(req, res){
        var name = req.body['project-name'];

        console.log('post!');
        console.log(req.file);
        if(req.file != undefined){
            console.log('files defined!');
            fs.readFile(req.file.path, function (err, data) {
                if(err)
                    console.log(err);

                console.log('saving image');
                var imgname = uuid.v4() + '.' + req.file.originalname.split('.')[1];
                var newPath = __dirname + "/../projects/img/" + imgname;
                fs.writeFile(newPath, data, function (err) {
                    if(err)
                        console.log(err);

                    create(name, imgname, function(){
                        res.redirect("back");//res.status(200).send('').end();
                    });
                });
            });
        }else{
            console.log('files not defined!');
            res.redirect("back");//res.status(200).send('').end();
        }
    });

    db.check(config.tables.projects, function(exists){
        if(!exists){
            db.create(config.tables.projects, fields, function(result){
                if(result.err){
                    log.error('Error when creating \'' + config.tables.projects +'\' table! ' + result.msg, config.logging_prefixes.projects);
                    return;
                }else{
                    create('Default Project', 'default.png', function(){
                        updateProjectList(function(){
                            callback();
                        });
                    });
                }
            });
        }else{
            updateProjectList();
            callback();
        }
    });
}
exports.init = init;

function create(name, image, callback){
    log.warning('Creating new project \'' + name + '\'...', config.logging_prefixes.projects);
    db.insert(config.tables.projects, [
        {col:'name', value: name },
        {col:'image', value: image }
    ], function(){
        updateProjectList();
        log.success('Created new project \'' + name + '\'', config.logging_prefixes.projects);
        callback();
    });
}
exports.create = create;

function list(callback){
    db.select(config.tables.projects, '*', function(result){
        if(result.err){
            log.error('Error when getting table list! ' + result.msg, config.logging_prefixes.projects);
            callback(undefined);
        }else{
            callback(result.data);
        }
    });
}
exports.list = list;

function get(id, callback){
    console.log('finding project with id ' + id)
//    exports.projects.forEach(function(el){
//        if(el.id == id){
//            console.log('found project! ' + id)
//            if(callback != undefined)
//                callback(el);
//            return el;
//        }
//    });
    for(var i = 0; i < exports.projects.length; ++i){
        if(exports.projects[i].id == id){
            console.log('found project! ' + id)
            if(callback != undefined)
                callback(exports.projects[i]);
            return exports.projects[i];
        }
    }
    console.log('failed to find project! ' + id)
    if(callback != undefined)
        callback(undefined);
    return undefined;
}
exports.get = get;

function updateProjectList(callback){
    list(function(result){
        exports.projects = result;
        log.success('Updated project list',config.logging_prefixes.projects);
        if(callback != undefined)
            callback();
    });
}

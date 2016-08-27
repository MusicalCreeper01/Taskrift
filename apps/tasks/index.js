/* ===== TASKS PLUGIN ===== */

var path = require('path')
var ejs = require('ejs');
var fs = require('fs');

var db = require('./database');

var app = require('../../app/apps');

exports.name = "Tasks";
exports.slug = "tasks";

exports.icon = "pencil";

exports.load = 'second';
exports.load_after = 'dashboard';
exports.load_before = null;

exports.modals = [
    {name:'Add Task', slug:'add-task'}
];

exports.run = function(callback){
    db.init(function(){

        app.get('/tasks', function(req, res){
            db.list(function(result){
                res.send(result);
                res.status(200);
            });
        })

        app.get('/tasks/:pid', function(req, res){
            db.get(req.params.pid, function(result){
                res.send(result);
                res.status(200);
            });
        })

        app.post('/tasks/update/:pid', function(req, res){
            var data = req.body.data;

        })

        app.post('/tasks/delete/:pid', function(req, res){
            db.delete(req.params.pid, function(){
                res.status(200).send('').end();
            });
        })

        app.post('/tasks/add', function(req, res){
            var name = req.body.name;
            var desc = req.body.desc;
            var project = req.body.project;

            db.add(name, desc, project, function(insertedId){
                db.getRow(insertedId, function(row){
                    res.status(200).send(row[0]).end();
                });
            });
        });

        callback();
    });
}

exports.render = function(mobile, user, projectId){
    if(projectId == null || projectId == undefined)
        return '';
    var templateString = fs.readFileSync(__dirname + '/views/index.ejs', 'utf-8');
    var renderedejs = ejs.render(templateString, {
        mobile: mobile,
        tasks: db.getSync(projectId)//db.tasks//
    });
    return renderedejs;
}

/* ===== TASKS PLUGIN ===== */

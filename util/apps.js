var log = new (require('./log.js'))();
var path = require('path')
var ejs = require('ejs');
var fs = require('fs');

var wait = require('wait.for');

var appsdir = "../apps";
var normalizedPath = require("path").join(__dirname, appsdir);

exports.default = "dashboard";

function verifyApp (app){
    if(app.name == null || app.name == undefined){
        log.error('Name veritifcation failed!', appsPrefix);
        return false;
    }

    if(app.slug == null || app.slug == undefined){
        log.error('Slug veritifcation failed!', appsPrefix);
        return false;
    }

    if(app.icon == null || app.icon == undefined){
        log.error('Icon veritifcation failed!', appsPrefix);
        return false;
    }

    if(app.run == null || app.run == undefined){
        log.error('Run veritifcation failed!', appsPrefix);
        return false;
    }

    if(app.render == null || app.render == undefined){
        log.error('Render veritifcation failed!', appsPrefix);
        return false;
    }

    log.success('Verified app ' + app.slug + '!');

    return true;
}
var apps = {};
function loadapps (callback) {
    var loadOrders = {
        'first': 0,
        'second': 1,
        'third': 2,
        'fourth' : 3,
        'fifth': 4
    };


    var allApps = []

    fs.readdirSync(normalizedPath).filter(function(file) {
        if(fs.statSync(path.join(normalizedPath, file)).isDirectory()){
            if(fs.existsSync(path.join(normalizedPath, file, 'index.js'))){
                var p = path.join(normalizedPath, file, 'index.js');
                var app = require(p);
                if(verifyApp){
                    app.path = path.join(normalizedPath, file);
                    allApps.push(app);
                }
            }
        }


    });

    //http://stackoverflow.com/questions/14872554/sorting-on-a-custom-order/14872766#14872766

    var ordering = {}, // map for efficient lookup of sortIndex
        sortOrder = ['first','second','third', 'forth', 'fifth', undefined, 'last'];
    for (var i=0; i<sortOrder.length; i++)
        ordering[sortOrder[i]] = i;
    allApps.sort( function(a, b) {
        return (ordering[a.load] - ordering[b.load]) || a.slug.localeCompare(b.slug);
    });
    exports.allApps = allApps;
    wait.launchFiber(l, allApps, callback)
}
/* Function for loading functions with callback syncronously to ensure
      that apps are loaded in the correct order*/
function l (allApps, callback){
    allApps.forEach(function(app){
        log.info('Executing app ' + app.slug);

        wait.forMethod(app, 'run');
        
        apps[app.slug] = app;
        exports.apps = apps;
    });
    exports.apps = apps;
    callback();
}

exports.loadapps = loadapps;

function getapp(slug){
    var p = path.join(normalizedPath, slug, 'index.js');
    var app = require(p);
    return app;
}
exports.getapp = getapp;

function render(slug, mobile, user, projectId){
    log.warning('rendering app..');
    return apps[slug].render(mobile, user, projectId);
}
exports.render = render;

exports.modals = function(project, mobile){
    console.log('generating modals');
    var modals = {};
    exports.allApps.forEach(function(app){
        console.log('for app ' + app.slug);
        modals[app.slug] = [];
        if(app.modals != undefined){
            app.modals.forEach(function(el){
                console.log('    for modal: ' + el.slug);
                var templateString = fs.readFileSync(app.path + '/views/modals/' + el.slug + '.ejs', 'utf-8');
                var renderedejs = ejs.render(templateString, {
                    apps: exports.apps,
                    projects: require('../util/projects').projects,
                    project: project,
                    mobile: mobile
                }); 
                el.data = renderedejs.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');//.replace(/"/g, '\"');
                modals[app.slug].push(el);
            });
        }
    });
    return modals;
}

/*



function listapps(){
    var apps = [];

    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        if(path.extname(file) == '.js'){
            var app = require("./"+appsdir+"/" + file);
            var _app = app;
            _app.path = "./"+appsdir+"/" + file;
            apps.push(_app);
        }
    });

    return apps;
}

exports.listapps = listapps;

function getdefault(){
    log.warning('getting default app..');
    var app = getapp(defaultapp);
    if(verifyApp(app)){
        return app;
    }else{
        log.warning('error verifying default app');
    }
}

exports.getdefault = getdefault;


function render(app, mobile, user){
    log.warning('rendering app..');
    if(app.header.length > 0)
        return app.display(mobile, user);
    else
        return '<div class="app-panel" panel="main">' + app.display(mobile) + '</div>';
}
exports.render = render;

function header(app, mobile){
    log.warning('getting app header..');

    var header = '';
    if(app.header.length > 0){
        if(!mobile){
            var i = 0;
            app.header.forEach(function(el){
                if(i == 0)
                    header += '<li class="appmenu"><a panel="'+el.panel+'" href="#" class="mainmenu-a active">'+el.name+'</a></li>';
                else
                    header += '<li class="appmenu"><a panel="'+el.panel+'" href="#" class="mainmenu-a">'+el.name+'</a></li>';
                ++i;
            });
        }else{
            var i = 0;
            app.header.forEach(function(el){
                if(i == 0)
                    header += '<a class="tab-item active" href="#" panel="'+el.panel+'"><span class="icon icon-'+el.icon+'"></span><span class="tab-label">'+el.name+'</span></a>';
                else
                    header += '<a class="tab-item" href="#" panel="'+el.panel+'"><span class="icon icon-'+el.icon+'"></span><span class="tab-label">'+el.name+'</span></a>';
                ++i;
            });
        }
    }else{
        if(mobile){
            header += '<a class="tab-item active" href="#" panel="main"><span class="icon icon-star"></span><span class="tab-label">'+app.name+'</span></a>';
        }
    }

    return header;
}
exports.header = header;*/
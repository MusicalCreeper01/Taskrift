/* Local modules for handling things like logging */
var config = require('./config.js');

var log = new (require('./util/log.js'))();
log.setLoggingLevel(config.logging_levels.server);

var database = require('./util/database.js');
var projects = require('./util/projects.js');
var accounts = require('./util/accounts.js');
var groups   = require('./util/groups.js');
var apps     = require('./util/apps.js');

/* configure port */
var port = 3000;
if(config.port != null){
    port = config.port;
}else{
    /*If the port enviroment variable is set, use it instead 3000
   This is used for if your running the server on something like Heroku,
   and it's usful if it's running in a Docker enviroment*/
    if(process.env.PORT)
        port = process.env.PORT;
}


database.init(function(){
    projects.init(function(){
        accounts.init(function(){
            groups.init(function(){
                var app = require('./app/apps');
                apps.loadapps(function(){
                    app.listen(3000, function(){
                        log.info('listening');
                    })
                });
            });
        });
    });
});

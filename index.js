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
if(process.env.PORT)
        port = process.env.PORT;
else if(config.port != null)
    port = config.port;


database.init(function(){
    projects.init(function(){
        accounts.init(function(){
            groups.init(function(){
                var app = require('./app/apps');
                apps.loadapps(function(){
                    app.listen(port, function(){
                        log.info('listening on port ' + port );
                    })
                });
            });
        });
    });
});

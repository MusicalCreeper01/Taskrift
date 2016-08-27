/* Server */
var express      = require('express');
var app          = express();

/* Authenitcation */
var passport     = require('passport');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var url          = require('url');
var methodOverride = require('method-override');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var flash        = require('connect-flash');
//var Strategy     = require('passport-local').Strategy;

/* Mobile compatability */
var device         = require('express-device');


/* Sockets for di-directional communication */
var io = require( "socket.io" )();

/* SASS pre-processor */
var sassMiddleware = require('node-sass-middleware');

var config = require('../config.js');

/* Device routing */
var device = require('express-device');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/../views');
app.set('view options', { layout: true });

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true })); // get information from html forms

app.use(session({ secret: config.session_secret, saveUninitialized: true, resave: false}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(device.capture({ parseUserAgent: true }));

device.enableViewRouting(app);
device.enableDeviceHelpers(app);

// adding the sass middleware
app.use(
    sassMiddleware({
        src: __dirname + '/../sass/'+config.theme, 
        dest: __dirname + '/../public',
        debug: false,
        prefix:  config.domain_root
    })
);   

require('../passport')(passport);

//app.use('/', require('./routes/routes.js'));   
require('../routes/routes.js')(app, express, passport);

module.exports = app;
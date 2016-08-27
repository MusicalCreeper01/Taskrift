//var express = require('express');
//var app = express.Router();
var favicon = require('serve-favicon');
var bcrypt  = require('bcrypt-nodejs');

var url = require('url');

var apps    = require('../util/apps.js');
var projects = require('../util/projects.js');

var config = require('../config');

function getCookie(req, res, cookie, def){
    var loadedslug = undefined;

    var querystring = url.parse(req.url, true).query;
    querystring = (querystring != undefined ? querystring[cookie] : undefined)

    if(querystring != undefined){
        //console.log('query string is defined')
        loadedslug = querystring;
        res.cookie(cookie, loadedslug);
    }else{
        if(req.cookies[cookie] == undefined){
            //console.log('cookie is not defined')
            loadedslug = def;
            res.cookie(cookie, loadedslug);
        }else{
            //console.log('cookie is defined')
            loadedslug = req.cookies[cookie];
        }
    }
    return loadedslug;
}

module.exports = function(app, express, passport) {

    app.use(favicon(__dirname + '/../public/favicon.ico'));
    app.use('/bower_components',  express.static(__dirname + '/../bower_components'));
    app.use('/',  express.static(__dirname + '/../public'));
    app.use('/projects/img',  express.static(__dirname + '/../projects/img'));

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    //Security wall that ensures people can't access anything beyond the login and signup pages without being authenticated
    //    app.all('*', require('connect-ensure-login').ensureLoggedIn(), function(req, res, next){
    //        next();
    //    });

    app.get('/', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
        var projectId = getCookie(req, res, 'project', undefined);
        var mobile =  req.device.type === 'phone' || req.device.type === 'tablet';
        //console.log('projectid ' + projectId);
        if(projectId != undefined && projectId != 'undefined'){
            var modals = apps.modals(projectId, mobile);
            //console.log(projects.projects);
            res.render('index', {
                user: req.user,
                users: require('../util/accounts').accounts,
                groups: require('../util/groups').groups,
                apps: apps.apps,
                modals: modals,
                projects: projects.projects,
                content: apps.render(getCookie(req, res, 'app', apps.default), mobile, req.user, projectId),
                project: projects.get(projectId),
                menubar: config.menubar
            });
        }else{
            res.render('overview', {
                user: req.user,
                projects: projects.projects,
                users: require('../util/accounts').accounts,
                groups: require('../util/groups').groups,
                menubar: config.menubar
            });
        }
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    module.exports = app;

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }
};

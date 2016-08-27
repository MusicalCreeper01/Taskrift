var LocalStrategy   = require('passport-local').Strategy;
var accounts = require('./util/accounts');


module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        accounts.findId(id, function(err, user) {
            if (err)
                done(null, user);
            
            done(null, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, username, password, done) {

        accounts.findOne(username, function(err, user){
            if(user) 
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));

            accounts.create(username, password, function(user){
                return done(null, user);
            }); 
        });
        
    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, username, password, done) { // callback with email and password from our form

        accounts.findOne(username, function(err, user){
            if(err)
                return done(err);

            if(!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));

            if(!user.passwordMatch(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

            return done(null, user);
        });

        //        if (!accounts.has(username)) {
        //            return done(null, false, req.flash('loginMessage', 'No user found.'));
        //        }else{
        //            accounts.password(username, password, function(valid){
        //                if(!valid)
        //                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
        //                else
        //                    return done(null, {id:2, username:username});
        //            });
        //        }
        //        
        //        // find a user whose email is the same as the forms email
        //        // we are checking to see if the user trying to login already exists
        //        User.findOne({ 'local.email' :  email }, function(err, user) {
        //            // if there are any errors, return the error before anything else
        //            if (err)
        //                return done(err);
        //
        //            // if no user is found, return the message
        //            if (!user)
        //                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
        //
        //            // if the user is found but the password is wrong
        //            if (!user.validPassword(password))
        //                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        //
        //            // all is well, return successful user
        //            return done(null, user);
        //        });

    }));

};
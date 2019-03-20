var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session'); 
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var index = require('./routes/index');
var users = require('./routes/users');
var bcrypt = require("bcrypt");

var username = "cmps369";
var password = "finalproject";
bcrypt.genSalt(10, function(err, salt) {
  bcrypt.hash(password, salt, function(err, hash) {
        password = hash;
        console.log("Hashed password = " + password);
    });
});

var app = express();
app.use(express.static(path.join(__dirname, 'public/stylesheets')));;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'cmps369'}))
app.use(express.static(path.join(__dirname, 'public')));

//login
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
{
usernameField: 'username',
passwordField: 'password'
},

function(user, pswd, done) {
if ( user != username ) {
    console.log("Username mismatch");
    return done(null, false);
}

bcrypt.compare(pswd, password, function(err, isMatch) {
    if (err) return done(err);
    if ( !isMatch ) {
        console.log("Password mismatch");
    }
    done(null, isMatch);
});
}
));

passport.serializeUser(function(username, done) {
  done(null, username);
});

passport.deserializeUser(function(username, done) {
  done(null, username);
});



index.post('/login',
    passport.authenticate('local', { successRedirect: '/contacts',
                                     failureRedirect: '/mailer',
                                  })
);

index.get('/login', function (req, res) {
  res.render('login', {});
});


index.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

/*index.post('/contacts',
    passport.authenticate('local', { successRedirect: '/contacts',
                                     failureRedirect: '/login',
                                  })
);
*/

app.use('/', index);
app.use('/users', users);



// catch 404 and forward to error handler


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});






module.exports = app;

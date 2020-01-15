var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require("passport");
var flash = require('connect-flash');
var bodyParser = require('body-parser');
LocalStrategy = require("passport-local").Strategy;
var MongoDBStore = require('connect-mongodb-session')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const accountant =require('./models/accountant');
const admin =require('./models/admin');

var sessionStore = new MongoDBStore({
  uri: 'mongodb://localhost/skl',
  collection: 'sessions'
  },
  function(error)
  {
    console.log(error);
  });
  sessionStore.on('error', function(error) {
    // Also get an error here
    console.log(error);
  });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());

app.use(cookieParser());
app.use(session({
  secret: 'sKl2020',
   resave: false,
   store: sessionStore,
   saveUninitialized: false,
  // cookie: { secure: true}
}));

// passport code
app.use(passport.initialize());
app.use(passport.session());
passport.use('accountant',new LocalStrategy(accountant.authenticate()));
passport.use('admin',new LocalStrategy(admin.authenticate()));

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  if(user!=null)
   done(null, user);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// pass currentUser to all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // req.user is an authenticated user
  res.locals.error = req.flash("error");
  res.locals.msg = req.flash("msg");
  next();
});

app.listen((process.env.PORT || 3000), function () {
    console.log("The Server Has Started! at port 3000");
  });


module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/accountant',accountantRouter);
app.use('/admin',adminRouter);
app.use(session({
  secret: 'SkL2k20',
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

app.listen((process.env.PORT || 7000), function () {
  console.log("The Server Has Started! at port 7000");
});

module.exports = app;

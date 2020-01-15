var express = require('express');
var passport = require("passport");
var mongoose = require('mongoose');
var router = express.Router();
// var db;
var fee = require('../models/fee');
var accountant = require('../models/accountant');
var admin =require('../models/admin');

// connecting to database #mongodb
let url = process.env.DATABASEURL || "mongodb://localhost/skl";
 mongoose.connect(url, { useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true },function(err,database){
    db=database;
    console.log('Connected to Mongodb!');
 });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET accounatant login page
router.get('/accountant_loginpage',function(req,res){
  req.flash("msg","Please Login to continue.");
  res.render('accountant_loginpage',{text:req.flash("msg")});
});

// GET accountant home page
router.get('/accountant_homepage',function(req,res){
  req.flash("msg","Logged in Successfully");
  res.render('accountant_homepage',{text:req.flash("msg")});
});

// GET accountant register page
router.get('/accountant_registerpage',function(req,res){
 req.flash("msg","Welcome to register page , Please register an accountant here.");
 res.render('accountant_registerpage',{text:req.flash("msg")});
});

// GET admin login page
router.get('/admin_loginpage',function(req,res){
  req.flash("msg","Please Login to continue.");
  res.render('admin_loginpage',{text:req.flash("msg")});
});

// GET admin home page
router.get('/admin_homepage',function(req,res){
  req.flash("msg","Logged in Successfully");
  res.render('admin_homepage',{text:req.flash("msg")});
});

//GET admin register page
router.get('/admin_registerpage',function(req,res){
  req.flash("msg","Register an admin here");
  res.render('admin_registerpage',{text:req.flash("msg")});
}); 
// GET to logout
router.get('/logout',function(req,res){
  req.logout();
  if(req.isAuthenticated())
  {
    req.flash("msg","Logout did not take place");
    res.render('accountant_homepage',{text:req.flash("msg")});
  }
  else{
    res.redirect('/accountant_loginpage');
  }
});

// Logout for admin
router.get('/signout_admin',function(req,res){
  req.logout();
  if(req.isAuthenticated())
  {
    req.flash("msg","Logout did not take place");
    res.render('admin_homepage',{text:req.flash("msg")});
  }
  else{
    req.flash("msg","Successfully logged out");
    res.render('admin_loginpage',{text:req.flash("msg")});
  }
});
// POST of accounatant_loginpage
router.post('/login_accountant',function(req,res,next){
  passport.authenticate("accountant", (err, user, info) => {
    console.log(info);
    if (err) {
        return next(err);
    }
    if (!user) {
        req.flash("msg", "Invalid username or password");
        return res.render('accountant_loginpage',{text:req.flash("msg")});
    }
    req.logIn(user, err => {
        if (err) {
            return next(err);
        }
            let redirectTo = req.session.redirectTo ? req.session.redirectTo : ('/accountant_homepage');
            delete req.session.redirectTo;            
            res.redirect(redirectTo);
   
    });
})(req, res, next);
}); 

// POST to login admin
router.post('/login_admin',function(req,res,next){
  passport.authenticate("admin", (err, user, info) => {
    console.log(info);
    if (err) {
        return next(err);
    }
    if (!user) {
        req.flash("msg", "Invalid username or password");
        return res.render('admin_loginpage',{text:req.flash("msg")});
    }
    req.logIn(user, err => {
        if (err) {
            return next(err);
        }
            let redirectTo = req.session.redirectTo ? req.session.redirectTo : ('/admin_homepage');
            delete req.session.redirectTo;            
            res.redirect(redirectTo);
   
    });
})(req, res, next);
}); 

// POST to register an accountant
router.post('/signupaccountant',function(req,res){

  var newUser = new accountant({
    username : req.body.username,
    email:req.body.email,
    mobile:req.body.mobile,
  });
  accountant.register(newUser, req.body.password, (err, user) => {
    if (err) {
        if (err.email === 'MongoError' && err.code === 11000) {
            // Duplicate email
            console.log(err);
            req.flash("msg","That email has already been taken");
            return res.render('accountant_registerpage',{msg:req.flash("msg")});
        }
        // Some other error
        console.log(err);
        return res.redirect("/error");
    }

    passport.authenticate("accountant")(req, res, () => {        
        console.log(newUser);
        req.flash("msg","Successfully Logged In");
        res.render('accountant_homepage',{text:req.flash("msg")});
    });
  });

});

// POST admin register
router.post('/signupadmin',function(req,res){

  var newUser1 = new admin({
    username : req.body.username,
    email:req.body.email,
    mobile:req.body.mobile,
  });
  admin.register(newUser1, req.body.password, (err, user) => {
    if (err) {
        if (err.email === 'MongoError' && err.code === 11000) {
            // Duplicate email
            console.log(err);
            req.flash("msg","That email has already been taken");
            return res.render('admin_registerpage',{msg:req.flash("msg")});
        }
        // Some other error
        console.log(err);
        return res.redirect("/error");
    }

    passport.authenticate("admin")(req, res, () => {        
        console.log(newUser1);
        req.flash("msg","Successfully Logged In");
        res.render('admin_homepage',{text:req.flash("msg")});
    });
  });

});



module.exports = router;

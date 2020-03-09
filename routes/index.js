var express = require('express');
var passport = require("passport");
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var shortid = require('shortid');
shortid.characters('0123456789');
var middleware = require("../middleware");
var router = express.Router();
var fee = require('../models/fee');
var accountant = require('../models/accountant');
var admin = require('../models/admin');
var student = require('../models/student');
var students = require('../models/student1');
mongoose.set('useFindAndModify', false);

// connecting to database #mongodb
// let url = process.env.DATABASEURL || "mongodb://localhost/school";
//  mongoose.connect(url, { useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true,useFindAndModify:false },function(err,database){
//     console.log('Connected to Mongodb!');
//  });

// mongo atlas
// connecting to mlab
const uri = "mongodb+srv://Eshwar:ani4anirudh1999%23@cluster-info-rm5w6.mongodb.net/school?retryWrites=true&w=majority";

mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex: true})
.then(() => console.log(`Connected to mlab..!!`))
.catch(err => console.log(`Database connection error: ${err.message}`));

// Forgot password code for admin
router.get('/forgot_admin',function(req,res){
  req.flash("msg","Reset Your Password here");
  res.render('forgot_admin',{text:req.flash("msg")});
});

router.post('/forgot_admin', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      admin.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash("msg", "No account with that email address exists.");
          console.log("No account with that email address exists.");
          return res.render('forgot_admin',{text:req.flash("msg")});
        }
        
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'mrcetclub@gmail.com',
          pass: '#thedarkangel'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'mrcetclub@gmail.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset_admin/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash("msg", "An e-mail has been sent to " + user.email + " with further instructions.");
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.render('forgot_admin',{text:req.flash("msg")});
  });
});

router.get('/reset_admin/:token', function(req, res) {
  admin.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash("msg", "Password reset token is invalid or has expired.");
      return res.render('forgot_admin',{text:req.flash("msg")});
    }
    res.render('reset_admin', {token: req.params.token});
  });
});

router.post('/reset_admin/:token', function(req, res) {
  async.waterfall([
    function(done) {
      admin.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          console.log("Password reset token is invalid or has expired.");
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          var password =req.body.password;
          user.setPassword(password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            console.log("Password don't match");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'mrcetclub@gmail.com',
          pass: '#thedarkangel'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'mrcetclub@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello, Admin\n\n' +
          'This is a confirmation that the password for your account with username :' + user.username + ' associated with email :' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash("msg", "Success! Your password has been changed.");
        console.log("Password changed");
        done(err);
      });
    }
  ], function(err) {
    res.render('admin_homepage',{text:req.flash("msg")});
  });
});

//  Forgot password code starts from here for accountant
router.get('/forgot',function(req,res){
  req.flash("msg","Reset Your Password here");
  res.render('forgot',{text:req.flash("msg")});
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      accountant.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash("msg", "No account with that email address exists.");
          console.log("No account with that email address exists.");
          return res.render('forgot',{text:req.flash("msg")});
        }
        
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'mrcetclub@gmail.com',
          pass: '#thedarkangel'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'mrcetclub@gmail.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash("message", "An e-mail has been sent to " + user.email + " with further instructions.");
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.render('forgot',{text:req.flash("message")});
  });
});

router.get('/reset/:token', function(req, res) {
  accountant.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash("msg", "Password reset token is invalid or has expired.");
      return res.render('forgot',{text:req.flash("msg")});
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      accountant.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          console.log("Password reset token is invalid or has expired.");
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          var password =req.body.password;
          user.setPassword(password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            console.log("Password don't match");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'mrcetclub@gmail.com',
          pass: '#thedarkangel'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'mrcetclub@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash("msg", "Success! Your password has been changed.");
        console.log("Password changed");
        done(err);
      });
    }
  ], function(err) {
    res.render('accountant_homepage',{text:req.flash("msg")});
  });
});

// All the GET Methods starts from here
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'School admission management system' });
});

// GET Mainpage
router.get('/mainpage',function(req,res,next){
  res.render('mainpage',{text:req.flash("msg")});
});

// GET accounatant login page
router.get('/accountant_loginpage',function(req,res){
  req.flash("msg","Please Login to continue.");
  res.render('accountant_loginpage',{text:req.flash("msg")});
});

// GET accountant home page
router.get('/accountant_homepage',middleware.checkAuthentication,function(req,res){
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
router.get('/admin_homepage',middleware.checkadminAuthentication,function(req,res){
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
  // console.log(req.isAuthenticated());
  req.logout();
  // console.log(req.isAuthenticated());
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
    res.redirect('/admin_loginpage');
  }
});

// GET for update fee page 
router.get('/update_fee',middleware.checkadminAuthentication,function(req,res){
  req.flash("msg","Update the fee here");
  res.render('update_fee',{text:req.flash("msg")});
});

//GET for search page
router.get('/search',middleware.checkadminAuthentication,function(req,res,next){
  req.flash("msg","Enter the admission number to search")
  res.render('search',{text:req.flash("msg"),student:""});
});

//GET for Student Info page
router.get('/insert_StudentInfo',middleware.checkadminAuthentication,function(req,res,next){
   // To display the fee deatails
   fee.find({},function(err,result){
    if(err)
    console.log(err);
    res.render('insert_StudentInfo',{list:result,text:'insert here'});
  });
 
});

// 
router.get('/createdata',function(req,res){
  fee.create({},function(err,result){
    if(err)
    console.log(err);
    console.log('created');
  });
  res.redirect('/');
});
// POST for update fee
router.post('/fee_update',function(req,res){
    // all the code goes here
    var className = req.body.optradio;
    var amount = req.body.amount;
    console.log(className,amount);
    // we have to create a collection to update any fee 
    fee.updateOne({[className]:amount }, function(err, res) {
      // Updated at most one doc, `res.modifiedCount` contains the number
      // of docs that MongoDB updated
      if(err) throw err;
      console.log(res);
    });
    req.flash("msg","Updated Sucessfully");
    res.render('update_fee',{text:req.flash("msg")})
});

//POST for search page
router.post('/search',function(req,res){
 var obj={
   admissionid:req.body.adminid}; 
 student.findOne(obj,function(err,result){
   if(err){
     console.log(err);
     res.render('/',{text:"Some Error happended please try after some time"});
   }
   if(result !== null)
   { 
     res.render('search',{text:'found',student:result});
    }
    else
    {
      res.render('search',{text:'not found',student:""});
    }
 });
});

//POST for Student Info page
router.post('/insert_StudentInfo',function(req,res,next){
   var obj={
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    fathername:req.body.fathername,
    phone_no:req.body.phone_no,  
    email:req.body.email,     
    rollno:req.body.rollno, 
    class:req.body.class,
    fee:0,
    admissionid:shortid.generate(),
  };
  // To create a student document in mongodb
  student.create(obj,function(err,result){
    if(err)
    {
      console.log(err);
    }
    console.log("inserted successfully...");
    res.render('displayed',{list:result,text:'inserted'});
    });
    // To display the fee deatails
    fee.find({},function(err,result){
      if(err)
      console.log(err);
     
    });
    
});

// GET for show page
router.get('/show',function(req,res,next){
  student.find({},function(err,result){
    if(err)
    console.log(err);
    res.render('show',{list:result});
  });
});

// GET for payment page
router.get('/payment',middleware.isLoggedIn,function(req,res){
  res.render('payment');
}); 

// POST for paymentInfo
router.post('/paymentInfo',function(req,res){
  student.findOne({admissionid:req.body.rollno},function(err,result){
    if(err)
    console.log(err);
    if(result !== null)
    res.render('paymentInfo',{list:result});
    else{
      res.render('paymentInfo',{list:0});
    }
  });
});

// GET for update student information
router.get('/update',middleware.checkadminAuthentication,function(req,res){
  res.render('update',{text:'update here'});
});

// GET for update
router.get('/update_StudentInfo',middleware.checkadminAuthentication,function(req,res){
  res.render('update_StudentInfo',{list:0,text:'update here'});
});

// POST for  update student information
router.post('/update_StudentInfo',function(req,res){
  var obj = {admissionid:req.body.rollno}
  student.findOne(obj,function(err,result){
    if(err)
    console.log(err);
    if(result !== null)
    res.render('update_StudentInfo',{list:result,text:'re-enter all the details for updating student info'});
    else
    res.render('update_StudentInfo',{list:0});
  });
});

// POST for updating student information
router.post('/updateInfo',function(req,res){
  var obj = {
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    fathername:req.body.fathername,
    phone_no:req.body.phone_no,  
    email:req.body.email,  
    rollno:req.body.r,   
    class:req.body.class,
    admissionid:req.body.admissionid
  }
  // console.log(obj);  
  student.replaceOne({admissionid:req.body.admissionid},obj,function(err,result){
    if(err)
    console.log(err);
    console.log(result);
  })
  res.render('update',{text:'updated'});
}); 

// GET for feepayment
router.get('/feepayment',middleware.checkadminAuthentication,function(req,res){
  res.render('feepayment',{text:'update here'});
});

// POST for payfee
router.post('/payfee',function(req,res){
  var obj = {
    fee:req.body.fee,
  }
  student.findOneAndUpdate({admissionid:req.body.rollno},obj,function(err,respone){
    if(err)
    console.log(err);
    console.log('updated fee');
  });
  res.render('feepayment',{text:' fee updated '});
});

// GET for create
router.get('/create',function(req,res){
  res.render('create',{text:'submit here'});
});


// POST to create dynamic collection
router.post('/create',function(req,res){

  var name = req.body.getname;
var newCollection = mongoose.model(name,students);

  newCollection.create({},function(err,result){
    if(err)
    console.log(err);
    else
    console.log("Done...!");
  });
  res.render('create',{text:'Done!'});
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
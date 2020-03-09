const accountant = require("../models/accountant");
const admin = require("../models/admin");

// all middleware goes here
const middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.session.redirectTo = req.originalUrl;
    req.flash("msg", "You need to be logged in first"); // add a one-time message before redirect
    res.redirect("/mainpage");
};

// accountant authentication middleware
middlewareObj.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        accountant.findById(req.user._id, (err, foundGroup) => {
            if (err || !foundGroup) {
                req.logout();
                console.log("logged out");
                req.flash("msg", "You Cannot Do that, kindly get authenticated");
                res.redirect("/mainpage");
            } else {
                 return next();
            }
        });
    } else {
         res.redirect("/accountant_loginpage");
    }
};

// admin authentication middleware
middlewareObj.checkadminAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        admin.findById(req.user._id, (err, foundGroup) => {
            if (err || !foundGroup) {
                req.logout();
                console.log(req.isAuthenticated());
                console.log("logged out");
                req.flash("msg", "You Cannot Do that, kindly get authenticated");
                res.redirect("/mainpage");
            } else {
                return next();
            }
        });
    } else {
        res.redirect("/admin_loginpage");
    }
};

middlewareObj.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        accountant.findById(req.user._id, (err, foundGroup) => {
            if (err || !foundGroup) {
                req.flash("error", "You Cannot Do that Please Logout First");
                res.redirect("/");
            } else {
                   return next();
            }
        });
    } else {
        res.redirect("/accountant_loginpage");
    }
};


module.exports = middlewareObj;

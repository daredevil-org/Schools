var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var db;
// connecting to database #mongodb
let url = process.env.DATABASEURL || "mongodb://localhost/project";
 mongoose.connect(url, { useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true },function(err,database){
    db=database;
    console.log('Connected to Mongodb!');
 });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

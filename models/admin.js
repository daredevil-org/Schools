var mongoose = require('mongoose');
var schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

var adminSchema = new schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        requried:true,
        unique:true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    
    mobile:{
        type:String,
        required:true,
    },
    
})
adminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('admin',adminSchema);

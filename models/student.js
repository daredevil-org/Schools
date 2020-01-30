var mongoose = require('mongoose');
var schema = mongoose.Schema;

var studentSchema = new schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    fathername:{
        type:String,
        required:true,
    },
    phone_no:{
        type:Number,
        required:true,
        },   
    email:{
        type:String,
        required:true,
        },
    rollno:{
        type:Number,
        required:true,
    },         
})

module.exports = mongoose.model('student',studentSchema);

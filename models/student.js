var mongoose = require('mongoose');
var schema = mongoose.Schema;

var studentSchema = new schema({
    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    fathername:{
        type:String,
    },
    phone_no:{
        type:Number,
        },   
    email:{
        type:String,
        },
    rollno:{
        type:Number,
    },         
})

module.exports = studentSchema;

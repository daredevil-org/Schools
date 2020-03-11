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
    email:{
        type:String,
        requried:true,
        unique:true
    },
    rollno:{
        type:String,
        required:true,
    },
    class:{
        type:Number,
        required:true,
    },
    phone_no:{
        type:Number,
        required:true,
    },
    fee:{
        type:Number,
        required:false,
        default:0,
    },
    admissionid:{
        type:String,
        required:false,
    }, 
    promoted:{
        type:Boolean,
        default:false,
    }
    
})

module.exports = mongoose.model('student',studentSchema);

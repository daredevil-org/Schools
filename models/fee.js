var mongoose = require('mongoose');
var schema = mongoose.Schema;

var feeSchema = new schema({
    donation:{
        type:Number,
        default:10000,
    },
    class_lkg:{
        type:Number,
       default:1,
    },
    class_ukg:{
        type:Number,
       default:1,
    },
    class_one:{
        type:Number,
       default:1,
    },
    class_two:{
        type:Number,
       default:1,
    },
    class_three:{
        type:Number,
       default:1,
    },
    class_four:{
        type:Number,
       default:1,
    },
    class_five:{
        type:Number,
       default:1,
    },
    class_six:{
        type:Number,
       default:1,
    },
    class_seven:{
        type:Number,
       default:1,
    },
    class_eight:{
        type:Number,
       default:10000,
    },
    class_nine:{
        type:Number,
       default:1,
    },
    class_ten:{
        type:Number,
       default:1,
    },
})


module.exports = mongoose.model('fee',feeSchema);
let mongoose = require("mongoose")
let uniqueValidator = require("mongoose-unique-validator")

let testSchema = mongoose.Schema({
    lab_id:{
        type: mongoose.Types.ObjectId,
        ref:"Labs",
        required:true
    },
    test_name:{
        type:String,
        required:true
    },
    test_desc:{
        type:String,
        required:true
    },
    test_cost:{
        type:Number,
        required:true
    },
    test_discount:{
        type:String,
    },
    availability:{
        type:String,
        default:"Available"
    },
    more_info:{
        type:String,
        required:true
    },
    reg_date:{
        type:Date,
        default:Date.now,
        required:true
    }


})

testSchema.plugin(uniqueValidator, {"message": "Test Already Exists"})
module.exports = mongoose.model("Test",testSchema)

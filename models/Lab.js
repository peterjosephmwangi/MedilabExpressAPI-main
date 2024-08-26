let mongoose = require("mongoose")
let uniqueValidator = require("mongoose-unique-validator")


let labSchema =  mongoose.Schema({
    lab_name:{
        type:String,
        required:true
    },
    business_permit:{
        type:Number,
        required:true
    },
    email:{
        type: String,
        unique:true,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    reg_date:{
        type:Date,
        default:Date.now,
        required:true
    }

})

labSchema.plugin(uniqueValidator, {"message": "Email Already in use"})

module.exports= mongoose.model("Lab",labSchema)


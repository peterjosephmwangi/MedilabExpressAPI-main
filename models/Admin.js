let mongoose = require("mongoose")
let uniqueValidator = require("mongoose-unique-validator")

let adminSchema = mongoose.Schema({
    email:{
        type:String,
        required :true,
        unique: true
    },
    username:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        default:1,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

})
// Add unique validator as a plugin to the Schema
adminSchema.plugin(uniqueValidator, {"message": "Email Already in use"})

module.exports= mongoose.model("Admin", adminSchema)
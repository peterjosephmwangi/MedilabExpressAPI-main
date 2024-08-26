let mongoose = require("mongoose")

let dependentSchema = mongoose.Schema({
    member_id :{
        type: mongoose.Types.ObjectId,
        ref:"Member",
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    others: {
        type: String,
        required: true
    },
    dob:{
        type: Date,
        // required: true
    },
    reg_date:{
        type:Date,
        default:Date.now,
        // required:true
    }
})

module.exports = mongoose.model("Dependant",dependentSchema)
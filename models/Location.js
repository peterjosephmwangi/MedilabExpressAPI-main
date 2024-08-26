let mongoose = require('mongoose')
const Member = require('./Member')

let locationSchema = mongoose.Schema({
    location_name : String,
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Member"
    }]
})

module.exports = mongoose.model("Location",locationSchema)
let mongoose = require('mongoose')
let uniqueValidator = require("mongoose-unique-validator")
let Location = require("./Location")
// const {default : mongoose} = require("mongoose")


let memberSchema = mongoose.Schema({
    surname : {
    type : String,
    required : true},

    others : {
    type : String,
    required : true},

    email : {
        type : String,
        required : true,
        unique : true},

    phone : {
        type : Number,
        required : true},

    gender : {
        type : String,
        required : true},

    dob: {
        type : Date,
        required : true},

   status :{
        type : Number,
        required : true,
        default: 1  },

    password : {
        type : String,
        required : true},

    location_id: {
        type : mongoose.Schema.Types.ObjectId, 
        ref :"Location",
        required : true},

    reg_date : {
        type : Date,
        default: Date.now},
})

memberSchema.plugin(uniqueValidator, {"message": "Email Already in use"})

module.exports = mongoose.model("Member",memberSchema)


let mongoose = require('mongoose')

let bookingsSchema = mongoose.Schema({
    member_id: {
        type:mongoose.Schema.Types.ObjectId, 
        ref :"Member",
        required : true
    },
    booked_for : {
        type : String,
        required : true},
    dependent_id: {
        type : mongoose.Schema.Types.ObjectId, 
        ref :"Dependant",
        },
        // One to many 
    test_id: {
        type : mongoose.Schema.Types.ObjectId, 
        ref :"Test",
        required : true},
    appointment_date : {
        type : String,
        required : true},
    appointment_time : {
        type : String,
        required : true},
    where_taken : {
        type : String,
        required : true},

    created_at : {
        type : Date,
        default: Date.now},

    latitude : {
        type :Number
    },

    longitude : {
        type :Number
    },

    status : {
        type :String,
        default:"Pending"
    },

    lab_id: {
        type : mongoose.Schema.Types.ObjectId, 
        ref :"Lab",
        required : true
    },

    invoice_no:{
        type: String,
        required : true
    }
})

module.exports = mongoose.model("Booking", bookingsSchema)
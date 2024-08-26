let mongoose = require("mongoose")


let paymentSchema = ({

    invoice_no:{
        type:String,
        required:true
    },
    total_amount:{
        type:Number,
        required:true
    },
    pay_date:{
        type:Date,
            }
})

module.exports = mongoose.model("Payment", paymentSchema)






// allocation_id 
// nurse_id 
// invoice_no 
// flag 
// reg_date 



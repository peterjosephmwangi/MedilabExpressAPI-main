let mongoose = require("mongoose")


let nurseAllocationSchema = ({

    nurse_id:{
        type:mongoose.Types.ObjectId,
        ref:"Nurses",
        required:true
    },
    invoice_no:{
        type:String,
        required:true
    },
    flag:{
        type:String,
        required:true,
    },
    reg_date:{
        type:Date,
        default:Date.now,
        required:true
    }
})

module.exports = mongoose.model("NurseAllocation", nurseAllocationSchema)






// allocation_id 
// nurse_id 
// invoice_no 
// flag 
// reg_date 



let express = require("express")
let bcrypt = require("bcrypt")
let router = express.Router()
let mongoose = require("mongoose")
let Member = require("../models/Member")
let Location = require("../models/Location")
let jwt = require("jsonwebtoken")
let constants = require("../lib/constants")
let verifyToken = require("../functions/middleware")
let invoiceNo = require("../functions/GenInvoiceNo")
let Booking = require("../models/Bookings")
let Payment = require("../models/Payment")
let mpesaSTKpush = require("../functions/mpesaAPI")
let Nurse = require("../models/Nurse")
let Task = require("../models/NurseAllocation")
let Dependant = require("../models/Dependant")
let Lab = require("../models/Lab")
let LabTest = require("../models/Tests")
const verifyAdminToken = require("../functions/verifyAdminToken")
let Admin = require("../models/Admin")
let genInvoiceNo = require("../functions/GenInvoiceNo")

// The Members system API

router.post("/member_signup", async (req, res) =>{
    let member = req.body
    let hashed_password = await bcrypt.hash(member.password,10)
    member.password = hashed_password;
    member = new Member(member);
    try {
        let savedMember = await member.save();
        let location_id = req.body.location_id
        let location = await Location.findById(location_id)
        if (location) {
            location.members.push(savedMember._id)
            const updatedLocation = await location.save()

        }
        res.status(200).json({"message":"Registration successful"})

    } catch (err){
        console.log(err)
        res.status(204).json({"message": err.message})

    }
    
});

router.post("/save_location", async (req,res)=> {
    let location = new Location(req.body)
    try {
        let savedLocation = await location.save()
        console.log(savedLocation)
        res.status(200).json({"message":"Registration successful"})
    } catch (err){
        res.status(204).json({"message": err.message})

    }
});

router.post("/member_signin", async (req,res) => {
    try {
        let member = await Member.findOne({"email":req.body.email})
        if (member) {
            // returns true if passwords hash match or false if they don't
            let passwordCheck = await bcrypt.compare(req.body.password, member.password)
            if (passwordCheck) {
                const token =jwt.sign({email: member.email}, constants.secretKey);
                res.status(200).json({"member_id":member._id, "token":token,"message":"Login successful"})
            } else {
                res.status(200).json({"message":"Incorrect credentials"})
            }

        }else {
            res.status(200).json({"message":"User not found"})
        }
    } catch (err) {
        console.log(err)

        res.status(204).json({"message":err.message})

    }
})

router.post("/member_profile",verifyToken, async (req,res) => {
    try {
        let member = await Member.findOne({_id:req.body.member_id},{ _id:1,surname:1,others:1,email:1,phone:1,gender:1,dob:1,location_id:1}).populate('location_id').exec()
        // convert to json
        member =  await member.toJSON()
        // access the location_name and add it as a new property
        member.location = member.location_id.location_name
        res.status(200).json(member)
    } catch (err){
        res.status(204).json({message:err.message})
    }
})

router.post("/add_dependants", verifyToken, async (req,res) => {
    let dependant = new Dependant(req.body)
    try {
        let savedDependant = await dependant.save();
        res.status(200).json({message:"Dependant saved successfully"})
        
    } catch (err) {
        console.log(err)

        res.status(204).json({"message":err})
        
    }
});

router.get("/view_dependant", verifyToken, async(req,res) =>{
    let member_id = req.body.member_id
    try {
        let dependants = await Dependant.find({member_id:member_id})
        res.status(200).json(dependants)
        
    } catch (err) {
        res.status(204).json({message:err.message})
        
    }
});

router.get("/laboratories", async(req,res) =>{
    try {
        let labs = await Lab.find()
        res.status(200).json(labs)
        
    } catch (err) {
        res.status(204).json({message:err.message})
        
    }
});

router.get("/locations", async(req,res) =>{
    try {
        let locations = await Location.find()
        res.status(200).json(locations)
        
    } catch (err) {
        res.status(204).json({message:err.message})
        
    }
});

router.get("/members", async(req,res) =>{
    try {
        let members = await Member.find()
        res.status(200).json(members)
        
    } catch (err) {
        res.status(204).json({message:err.message})
        
    }
});

router.get("/view_tests",verifyAdminToken, async(req,res) =>{

    try {
        let tests = await LabTest.find()
        res.status(200).json(tests)
        
    } catch (err) {
        res.status(204).json({message:err.message})
        
    }
});

router.get("/lab_tests",verifyAdminToken, async(req,res) =>{
    let lab_id = req.body.lab_id
    try {
        let tests = await LabTest.find({lab_id:lab_id})
        res.status(200).json(tests)
        
    } catch (err) {
        res.status(204).json({message:err.message})
        
    }
});




router.post("/lab_tests",  async(req,res) =>{
    let lab_id = req.body.lab_id
    try {
        let lab_test = await LabTest.find({lab_id:lab_id})
        res.status(200).json(lab_test)
        
    } catch (err) {
        res.status(204).json({message:err.message})
        
    }
});



router.post("/add_booking", verifyToken, async (req,res) => {
    let booking =req.body
    try {
        let invoice_no = genInvoiceNo()
        booking.invoice_no = invoice_no 
        booking = new Booking(booking)
        let savedBooking = await booking.save();

        let total_amount = 0;

        let test_id = booking.test_id
        let test = await LabTest.findOne({_id:test_id});
        total_amount += test.test_cost;
        console.log(test.test_cost)
        let payment = new Payment ({
            invoice_no: invoice_no,
            total_amount: total_amount
        })


        let savedPayment = await payment.save()
        console.log(savedBooking)
        res.status(200).json({"message":"You have successfully booked an appointment", "booking_id":savedBooking._id,"invoice_no":invoice_no,"total_amount":total_amount})
        
    } catch (err) {
        console.log(err)
        res.status(204).json({message:err.message})
        
    }
});

router.get("/view_bookings", verifyToken, async(req,res) =>{
    let member_id = req.body.member_id
    try {
        let bookings = await Booking.find({"member_id":member_id}).populate("test_id")
        res.status(200).json(bookings)
        
    } catch (err) {
        res.status(204).json({message:err.message})
        
    }
});

router.post("/member_make_payment", verifyToken, async (req,res) => {
    try {
        let paid = mpesaSTKpush(req.body.amount,req.body.phone,req.body.invoice_no)
        if( paid === 1){
            let payment = await Payment.findOne({invoice_no:req.body.invoice_no})
            let updatePayment = await Payment.updateOne({_id:payment._id},{$set:{pay_date:Date.now}})
            res.status(200).json({message:"Payment made successfully"})
        } else{
            throw Error("Payment unsuccessful")
        }
        
    } catch (err) {
        res.status(204).json({message:err.message})
        
    }
});


// The end of Member system API's


// The Lab system APIs

router.post("/lab_signup", async (req,res) => {
    console.log("here")
    let lab = req.body
    console.log(lab)
    let hashed_password = await bcrypt.hash(lab.password,10)
    lab.password = hashed_password;
    lab = new Lab(lab)
    try {
        let savedLab = await lab.save();
        res.status(200).json({message:"Lab added successfully"})
        
    } catch (err) {
        console.log(err)
        res.status(204).json({message:err.message})
        
    }
});

router.post("/lab_login",async (req,res) => {
    try {
        let lab = await Lab.findOne({"email":req.body.email})
        if (lab) {
            // returns true if passwords hash match or false if they don't
            let passwordCheck = await bcrypt.compare(req.body.password, lab.password)
            if (passwordCheck) {
                const token =jwt.sign({email: lab.email}, constants.adminsecretKey);
                res.status(200).json({"lab_id":lab._id, "token":token,"message":"Login successful","lab_name":lab.lab_name,})
            } else {
                res.status(200).json({"message":"Incorrect credentials"})
            }

        }else {
            console.log(err)

            res.status(200).json({"message":"lab not found"})
        }
    } catch (err) {
        console.log(err)
        res.status(204).json({"message":err.message})

    }
})

router.post("/labprofile", verifyAdminToken, async(req,res)=>{
    try {
        let lab = await Lab.findOne({_id:req.body.lab_id}, {lab_name:1, business_permit:1, email:1, phone:1})
        // lab =  await lab.toJSON()
        res.status(200).json({lab_details: lab})
    } catch (error) {
        res.status(204).json(error.message)
        
    }
})

router.post("/add_lab_test", verifyAdminToken, async (req,res) => {
    let labtest = new LabTest(req.body)
    try {
        let savedLabTest = await labtest.save();
        res.status(200).json({message:"Lab Test added successfully"})
        
    } catch (err) {
        res.status(204).json({message:err.message})
        
    }
});


router.post("/add_nurse", verifyAdminToken,async (req, res) =>{
    let nurse = req.body;
    // let hashed_password = await bcrypt.hash("nurse2024",10)
    // nurse.password = hashed_password;
    nurse = new Nurse(req.body);
    try {
        let savedNurse  = await nurse.save();
        res.status(200).json({"message":"Nurse registered successfully"})

    } catch (err){
        console.log(err)
        res.status(204).json({"message": err.message})

    }
    
});

router.post("/view_nurses",verifyAdminToken, async(req,res) =>{
    let lab_id = req.body.lab_id
    try {
        let nurses = await Nurse.find({lab_id:lab_id}, {surname:1, others:1, gender:1, email:1, reg_date:1, phone:1})
        res.status(200).json(nurses)
        
    } catch (err) {
        console.log(err)
        res.status(204).json({message:err.message})
        
    }
});

router.post("/lab_bookings", async(req,res) =>{
    let lab_id = req.body.lab_id
    // let our_bookings = []

    try {
        let bookings = await Booking.find({"lab_id":lab_id}, {invoice_no:1,where_taken:1,appointment_date:1,appointment_time:1}).populate("test_id").populate("member_id");
        var length = bookings.length

        for (var x = 0; x<length; x++) {
            let booking = bookings[x]
            booking= await booking.toJSON()
            booking.member_name = booking.member_id.surname + " " + booking.member_id.others
            booking.test_name = booking.test_id.test_name
            delete booking.member_id
            delete booking.test_id
            // our_bookings.push(booking)
            bookings[x] = booking
            
        }
        
        res.status(200).json(bookings)
        
    } catch (err) {
        console.log(err)
        res.status(204).json({message:err.message})
        
    }
});

router.post("/allocate_nurse", verifyAdminToken, async (req,res) => {
    let task = new Task(req.body)
    try {
        let savedTask = await task.save();
        res.status(200).json({message:"Task allocated successfully"})
        
    } catch (err) {
        res.status(204).json({message:err.message})
        
    }
});
// 


// The end of Lab system APIs


//Admin system APIs

router.post("/admin_login", async (req,res) => {
    try {
        let admin = await Admin.findOne({"email":req.body.email})
        if (admin) {
            // returns true if passwords hash match or false if they don't
            let passwordCheck = await bcrypt.compare(req.body.password, admin.password)
            if (passwordCheck) {
                const token =jwt.sign({email: admin.email}, constants.admin_secretkey);
                res.status(200).json({"admin_ID":admin._id, "token":token,"message":"Login successful"})
            } else {
                res.status(200).json({"message":"Incorrect credentials"})
            }

        }else {
            res.status(200).json({"message":"Admin not found"})
        }
    } catch (err) {
        res.status(204).json({"message":err.message})

    }
})

module.exports = router;


let togglePassword=()=>{
    const passwordLogin =  document.getElementById('passwordLg')
    if (passwordLogin.type === 'password') {        
      } else {
        passwordLogin.type = 'password'
      }
    }

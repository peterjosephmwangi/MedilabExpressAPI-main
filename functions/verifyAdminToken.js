var constants=require('../lib/constants');
let jwt = require("jsonwebtoken");
let verifyAdminToken=(req,res,next)=>{
    let token = req.headers['authorization']
    if(typeof token !=='undefined'){
        console.log(token)
        const tokenArray = token.split(' ')
        token = tokenArray[1]
        console.log(token);
        jwt.verify(token,constants.adminsecretKey,(err , decoded)=>{
            if (err){
                res.status(403).json({message : "unauthorized access"})
            }else{
                req.email=decoded.email
                next();
            }
        })
    } else {
        res.status(403).json({message:"Unauthorized access"})
    }

}


module.exports=verifyAdminToken
let constants = require("../lib/constants")
let jwt = require("jsonwebtoken")

function verifyToken(req,res,next){
    let token = req.headers['authorization'];
    if(typeof token !='undefined'){
        const tokenArray = token.split(' ');
        // TokenArray is usually the bearer and the token thus we split it to get our token
        token = tokenArray[1]
        jwt.verify(token, constants.secretKey, (err,decoded)=>{
            if (err){
                res.status(403).json({message: "Unauthorized Access"})
            }else{
                req.email = decoded.email
                next();
            }
    })
}else{
    res.status(403).json({message: "Forbidden Access"})

}

}

module.exports = verifyToken;
// import request from "request";
let request = require("request")
// import 'dotenv/config'
let ngrok = require("ngrok")

const accessToken = (req, res, next)=> {
    let SAFARICOM_CONSUMER_KEY = "GTWADFxIpUfDoNikNGqq1C3023evM6UH"
    let SAFARICOM_CONSUMER_SECRET = "amFbAoUByPV2rM5A"

    try{

        const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        const auth = new Buffer.from(`${SAFARICOM_CONSUMER_KEY}:${SAFARICOM_CONSUMER_SECRET}`).toString('base64');
        return new Promise(function (resolve, reject) {
        request(
            {
                url: url,
                headers: {
                    "Authorization": "Basic " + auth
                }
            },
            (error, response, body) => {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(body)
                }
            });
    })
    }catch (error) {

        console.error("Access token error ", error)
        res.status(401).send({
            "message": 'Something went wrong when trying to process your payment',
            "error":error.message
        })
    }

}

function parseDate(val) {
    return (val < 10) ? "0" + val : val;
}

const  getTimestamp = () => {

    const dateString  = new Date().toLocaleString("en-us", {timeZone: "Africa/Nairobi"})
    const dateObject = new Date(dateString);
    const month  = parseDate(dateObject.getMonth() + 1);
    const day  = parseDate(dateObject.getDate());
    const hour = parseDate(dateObject.getHours());
    const minute = parseDate(dateObject.getMinutes());
    const second = parseDate(dateObject.getSeconds());
    return dateObject.getFullYear() + "" + month + "" + day + "" +
        hour + "" + minute + "" + second;
}




// @desc initiate stk push
// @method POST
// @route /stkPush
// @access public
const initiateSTKPush = async(amount,phone,invoice_no ) => {
    try{
        let access_token;
        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
        try {
            let response = await accessToken();
            access_token = JSON.parse(response).access_token
            console.log(access_token)          
        } catch (error) {
            console.error(error);
        }
        if(access_token){const auth = "Bearer " + access_token;

            console.log(auth)
        

        const timestamp = getTimestamp()
        //shortcode + passkey + timestamp
        const SHORT_CODE = 174379;
        const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'


        const password = new Buffer.from(SHORT_CODE + passkey + timestamp).toString('base64')
        // create callback url
       // const callback_url = await ngrok.connect(process.env
       //.PORT);
        //const api = ngrok.getApi();
        //await api.listTunnels();


       // console.log("callback ",callback_url)
        request(
            {
                url: url,
                method: "POST",
                headers: {
                    "Authorization": auth
                },
                json: {
                    "BusinessShortCode": 174379,
                    "Password": password,
                    "Timestamp": timestamp,
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": amount,
                    "PartyA": phone,
                    "PartyB": 174379,
                    "PhoneNumber": phone,
                    "CallBackURL": "https://anjanatech.co.ke/confirmation/",
                    "AccountReference":invoice_no,
                    "TransactionDesc": "Paid online"
                }
            },
            function (e, response, body) {
                if (e) {
                    console.error(e)
                    console.log({
                        message:"Error with the stk push",
                        error : e
                    })
                } else {
                    return 1
                    console.log(body)
                }
            }
        )}
        else{
            return 0
            console.log("Invalid token")
        }
    }catch (e) {
        console.error("Error while trying to create LipaNaMpesa details",e)
        console.log({
            message:"Something went wrong while trying to create LipaNaMpesa details. Contact admin",
            error : e
        })
    }
}
module.exports =initiateSTKPush

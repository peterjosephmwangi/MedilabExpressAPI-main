function invoiceNo (){
   let invoice_no = Math.floor(Math.random()* 10001)
   let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
   let charsLength = chars.length;
   let counter = 0 
   while (counter < 9){
    invoice_no += chars.charAt(Math.floor(Math.random() *charsLength));
    counter++
    return invoice_no

   }
   return invoice_no
}
console.log(invoiceNo())



// charAt returns the charcter at the specific index
module.exports = invoiceNo;
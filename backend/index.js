const express=require("express")
const cors=require("cors")
const nodemailer = require("nodemailer");
const mongoose =require("mongoose")

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://Indhu:Indhu%40530@cluster0.pzv3i.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function(){
  console.log("Succesfully connected")
})
.catch(function(error){
  console.log("failed to connect")
  console.log(error)
})

const credential=mongoose.model("credential",{},"bulkmail")




app.post("/sendmail",function(req,res){
  var msg = req.body.msg
  var emaillist=req.body.emaillist
  
  credential.find().then(function(data){
    const transporter = nodemailer.createTransport({
      service:"gmail",
      auth: {
        user:data[0].toJSON().user ,
        pass: data[0].toJSON().pass,
      },
    });
    new Promise( async function(resolve,reject){
      try{
        for (let i=0;i<emaillist.length;i++){
           await transporter.sendMail({
      
            from: "buvaneshwari830@gmail.com",
            to: emaillist[i],
            subject: "Hello ✔", 
            text: msg, 
            
          },);
          console.log("Email sent to:"+emaillist[i])
        }
        resolve("success")
      }
      catch(error){
        reject("failed")
      }
    }).then(function(){
      res.send(true)
    })
    .catch(function(){
      res.send(false)
    })
  })
  
  .catch(function(error){
    console.log(error)
  })
 
  
  
 
 
})


app.listen(5000,function(){
  console.log("server started")
})
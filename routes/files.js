//route for posting files ....

const router=require("express").Router();
const multer=require("multer");
const path=require("path");
const File=require("../models/file");

const {v4:uuid4}=require("uuid");

let storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,"uploads/"),
    filename:(req,file,cb)=>{
        const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }
})

let upload=multer({
    storage:storage,
    limit:{fileSize:1000000 * 100},
}).single("myfile");

router.get("/",function (req,res) {
    res.sendFile(__dirname + '../public/index.html');
})

router.post("/",(req,res)=>{
    //store file
    upload(req,res,async function(err){
        //validate
        if(!req.file){
            return res.json({err:'All fields are required.'});
        }

        if(err)
        return res.status(500).send({error:err.message})
        //else: store into db
        const file=new File({
            filename:req.file.filename,
            uuid:uuid4(),
            path:req.file.path,
            size:req.file.size
        });
        const response=await file.save();
        return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});
        //http://localhost:3000/files/234dsjbsa-234vdavjdb
    })
})

router.post("/send",async function (req,res) {
    const{uuid,emailFrom,emailTo}=req.body;
    if(!uuid || !emailFrom || !emailTo){
        return res.status(422).send({error:"All Fields are required"});
    }
    //get data from database
    const file=await File.findOne({uuid:uuid});
    

    file.sender=emailFrom;
    file.receiver=emailTo;
    const response=await file.save();

    //sendmail
    const sendMail=require("../services/mail");
    sendMail({
        to:emailTo,
        from:emailFrom,
        subject:"File sharing...",
        text:`${emailFrom} sharing file with you`,
        html:require("../services/emailTemplate")({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000)+"KB",
            expires:"24 hours"
        }) //first we require email template means initialised then we have to call so we did () there.
    })
    return res.send({success:true});
})

module.exports=router;
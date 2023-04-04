const router=require("express").Router();
const File=require("../models/file");


router.get("/:uuid",async function(req,res){
    try{
        const file=await File.findOne({uuid:req.params.uuid});
        if(!file){
            return res.render("download",{error:"Link has been expired"});
        }
        return res.render("download",{
            uuid:file.uuid,
            fileName:file.fileName,
            fileSize:file.size,
            download:`${process.env.APP_BASE_URL}/files/download/${file.uuid}`
            //http:3000/localhost/files/download/jdsvbsavnvk-kvkjdvjdvkmd
        });
    }catch(err){
        return res.render("download",{error:"Something Went Wrong"});
    }
})

module.exports=router;
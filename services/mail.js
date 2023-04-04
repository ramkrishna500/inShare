const nodemailer=require("nodemailer");

async function sendMail({to,from,subject,text,html}){
    let transporter=nodemailer.createTransport({
        host:process.env.HOST_NAME,
        port:process.env.PORT_NAME,
        secure:false,
        auth:({
            user:process.env.USER,
            pass:process.env.PASS
        })
    })

    let info=await transporter.sendMail({
        to:to,
        from:`inshare <${from}>`,
        subject:subject,
        text:text,
        html:html
    })
}

module.exports=sendMail;
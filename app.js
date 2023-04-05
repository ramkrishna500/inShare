const express = require("express");
const path = require("path");
const app=express();

const cors=require("cors");


const PORT=process.env.PORT || 3000;
app.use(express.static("public"));
app.use(express.json()); //we have explicitly tell to accept json data

const connectDB=require("./config/db");
connectDB();

//cores setup
const corsOption={
    origin:env.process.ALLOWED_CLIENTS.split(",")
    //[localhost:3000,localhost:5000....]
}

app.use(cors(corsOption));
//template engine
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");

//routes
app.use("/api/files",require("./routes/files"));
app.use("/files",require("./routes/show"));
app.use("/files/download",require("./routes/download"));

app.listen(PORT,function(){
    console.log(`listening to port ${PORT}`);
})
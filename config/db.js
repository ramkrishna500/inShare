require("dotenv").config();

const mongoose=require("mongoose");
mongoose.set('strictQuery', false);
function connectDB(){
    try {
        // Connect to the MongoDB cluster
         mongoose.connect(
          process.env.MONGO_CONNECTION_URL,{ useNewUrlParser: true, useUnifiedTopology: true },
          function() {console.log(" Mongoose is connected")}
        );
      } catch (e) {
        console.log("could not connect");
      }
}

module.exports=connectDB;

